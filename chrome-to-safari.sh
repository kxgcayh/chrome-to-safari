#!/bin/bash
set -euo pipefail

# chrome-to-safari.sh — manage a personal farm of Chrome extensions converted
# to signed, installed Safari extensions. No paid Apple Developer ID needed.
#
# Every extension lives in extensions/<slug>/ :
#
#   src/        the Chrome source. THE place to edit. For store forks it starts
#               pristine; your changes are git commits on top of an upstream
#               commit marked "[c2s]".
#   safari/     optional overlay copied over src/ at build time. Use it for
#               Safari-only files, and safari/manifest.patch.json (deep-merged
#               into manifest.json) for Safari-only manifest keys.
#   meta.json   identity: app name, bundle id, origin (store/local), versions.
#   project/    GENERATED converter output — disposable, rebuilt every install,
#               never committed, never holds edits.
#
# Usage:
#   ./chrome-to-safari.sh add <store-url | folder> [--name N] [--bundle-id B] [--no-install]
#   ./chrome-to-safari.sh install [slug|all] [--no-launch]
#   ./chrome-to-safari.sh update [slug|all] [--check] [--no-install]
#   ./chrome-to-safari.sh list
#   ./chrome-to-safari.sh ui
#
# Typing an old-style source (path or URL) without a verb is shorthand for `add`.
# Env overrides: TEAM_ID (signing team), C2S_EXTENSIONS (extensions directory).

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
SCRIPT_PATH="$REPO_ROOT/chrome-to-safari.sh"
EXTENSIONS_DIR="${C2S_EXTENSIONS:-$REPO_ROOT/extensions}"

C2S_TMP="$(mktemp -d)"   # all scratch files live here; removed on exit
trap 'rm -rf "$C2S_TMP"' EXIT

LSREGISTER="/System/Library/Frameworks/CoreServices.framework/Versions/Current/Frameworks/LaunchServices.framework/Versions/Current/Support/lsregister"

# --- helpers -------------------------------------------------------------------

die()      { echo "ERROR: $*" >&2; exit 1; }
info()     { echo "==> $*"; }
have_cmd() { command -v "$1" >/dev/null 2>&1; }

usage() { sed -n '2,27p' "$0"; }

clean_app_name() { # the name ends up in filesystem paths under /Applications
  printf '%s' "$1" | tr '/' '-' | sed 's/^\.*//'
}

slugify() {
  printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]\{1,\}/-/g; s/^-//; s/-$//'
}

json_field() { # file, key -> value ("" when absent)
  python3 -c 'import json,sys
try: d=json.load(open(sys.argv[1]))
except Exception: d={}
v=d.get(sys.argv[2],"")
print("" if v is None else v)' "$1" "$2"
}

manifest_field() { # manifest.json, key -> value
  python3 -c 'import json,sys
d=json.load(open(sys.argv[1]))
print(d.get(sys.argv[2],""))' "$1" "$2"
}

manifest_name() { # manifest.json -> display name, resolving __MSG_key__ via _locales
  python3 -c 'import json,sys,re,os

m = json.load(open(sys.argv[1]))
name = m.get("name", "")
match = re.match(r"^__MSG_(.+)__$", name or "")
if not match:
    print(name); raise SystemExit
key = match.group(1)
locales_dir = sys.argv[2]
order = [m.get("default_locale", ""), "en"]
for cand in order:
    if not cand:
        continue
    messages_path = os.path.join(locales_dir, cand, "messages.json")
    if not os.path.exists(messages_path):
        continue
    with open(messages_path) as f:
        messages = json.load(f)
    for k, v in messages.items():
        if k.lower() == key.lower() and isinstance(v, dict):
            print(v.get("message", "")); raise SystemExit
print("")' "$1" "$(dirname "$1")/_locales"
}

url_slug_from_store_url() { # <store-url> -> <name> part of /detail/<name>/<id>
  printf '%s' "$1" | sed -n 's|.*/detail/\([^/]*\)/.*|\1|p'
}

meta_set_version() { # meta.json, version
  python3 -c 'import json,sys
p,v=sys.argv[1],sys.argv[2]
d=json.load(open(p))
d["upstream_version"]=v
with open(p,"w") as f:
    json.dump(d,f,indent=2)
    f.write("\n")' "$1" "$2"
}

detect_team_id() {
  security find-certificate -c "Apple Development" -p 2>/dev/null \
    | openssl x509 -noout -subject 2>/dev/null \
    | sed -n 's/.*OU *= *\([A-Z0-9]\{10\}\).*/\1/p' || true
}

require_team_id() {
  TEAM_ID="${TEAM_ID:-$(detect_team_id)}"
  if [ -z "$TEAM_ID" ]; then
    cat >&2 <<'EOF'
ERROR: No Apple Development certificate found.

One-time setup (free, no paid developer account needed):
  1. Open Xcode > Settings > Accounts
  2. Click "+" and sign in with your Apple ID
  3. Select your account > "Manage Certificates..." > "+" > "Apple Development"
  4. Re-run this command

Without this, Safari treats the extension as unsigned and disables it
on every restart.
EOF
    exit 1
  fi
  echo "==> Team ID:   $TEAM_ID"
}

git_run() { # act only when the farm itself is a git checkout
  git -C "$REPO_ROOT" "$@"
}

repo_is_git() {
  [ -d "$REPO_ROOT/.git" ] && have_cmd git
}

ext_rel_path() { # <slug> -> extension dir relative to the repo root (for git pathspecs)
  python3 -c 'import os,sys; print(os.path.relpath(sys.argv[1], sys.argv[2]))' \
    "$EXTENSIONS_DIR/$1" "$REPO_ROOT"
}

# --- Chrome Web Store downloads -------------------------------------------------

store_id_from_url() { # <store-url> -> echoes 32-char id (letters a-p)
  printf '%s' "$1" | grep -oE '[a-p]{32}' | head -1 || true
}

crx_fetch() { # <32-char-ext-id> -> echoes the extracted directory (chatter goes to stderr)
  local ext_id="$1"
  local dl_dir
  dl_dir="$(mktemp -d "$C2S_TMP/crx.XXXXXX")/${ext_id}"
  mkdir -p "$dl_dir"
  info "Downloading $ext_id from Chrome Web Store..." >&2
  curl -fsSL -o "$dl_dir.crx" \
    "https://clients2.google.com/service/update2/crx?response=redirect&prodversion=140.0&acceptformat=crx2,crx3&x=id%3D${ext_id}%26uc" \
    || die "download failed — check your network or the extension ID"
  # a .crx is a zip with a binary header; unzip skips the junk but exits nonzero
  unzip -qo "$dl_dir.crx" -d "$dl_dir" 2>/dev/null || true
  [ -f "$dl_dir/manifest.json" ] || die "download failed — no manifest.json in the downloaded package"
  rm -rf "$dl_dir/_metadata"   # store signing artifacts; the converter chokes on them
  printf '%s' "$dl_dir"
}

# --- the build pipeline: sync -> convert -> build -> install --------------------

replace_src() { # <extension-dir> <fresh-dir>: swap src/ for a new upstream copy
  rm -rf "$1/src" && mkdir -p "$1/src" && cp -R "$2/." "$1/src/" || die "could not replace $1/src"
}

sync_staging() { # <slug>, <staging-dir>: src + safari overlay merged
  local dir="$EXTENSIONS_DIR/$1"
  local staging="$2"
  mkdir -p "$staging"
  cp -R "$dir/src/." "$staging/"
  if [ -d "$dir/safari" ]; then
    cp -R "$dir/safari/." "$staging/" 2>/dev/null || true
  fi
  rm -f "$staging/.gitkeep" "$staging/manifest.patch.json"
  local patch="$dir/safari/manifest.patch.json"
  if [ -f "$patch" ]; then
    info "Applying Safari manifest patch..."
    python3 -c 'import json,sys

def merge(base, extra):
    for k, v in extra.items():
        if isinstance(v, dict) and isinstance(base.get(k), dict):
            merge(base[k], v)
        else:
            base[k] = v

patch_path, manifest_path = sys.argv[1], sys.argv[2]
with open(patch_path) as f:
    patch = json.load(f)
with open(manifest_path) as f:
    manifest = json.load(f)
merge(manifest, patch)
with open(manifest_path, "w") as f:
    json.dump(manifest, f, indent=2)
    f.write("\n")' "$patch" "$staging/manifest.json"
  fi
  [ -f "$staging/manifest.json" ] || die "sync produced no manifest.json — is src/ intact?"
}

normalize_bundle_ids() { # <xcodeproj>
  # The converter sometimes derives the app's bundle ID from the app name while
  # giving the extension the ID passed via --bundle-identifier. If they differ,
  # the build fails with "Embedded binary's bundle identifier is not prefixed
  # with the parent app's bundle identifier". Normalize: make the extension's
  # ID always be <app ID>.Extension.
  local pbx="$1/project.pbxproj"
  local app_id
  app_id="$(grep -o 'PRODUCT_BUNDLE_IDENTIFIER = "\{0,1\}[^";]*' "$pbx" \
    | sed 's/.*= "\{0,1\}//' | grep -v '\.Extension$' | head -1 || true)"
  [ -n "$app_id" ] || return 0
  sed -i '' "s/PRODUCT_BUNDLE_IDENTIFIER = \"\{0,1\}[^\";]*\.Extension\"\{0,1\};/PRODUCT_BUNDLE_IDENTIFIER = \"$app_id.Extension\";/g" "$pbx"
}

build_and_install_one() { # <slug> [--no-launch]
  local slug="$1"
  local no_launch="${2:-}"
  local dir="$EXTENSIONS_DIR/$slug"
  [ -f "$dir/meta.json" ] || die "extensions/$slug has no meta.json — not a managed extension?"
  [ -f "$dir/src/manifest.json" ] || die "extensions/$slug/src/manifest.json missing"

  local app_name bundle_id
  app_name="$(json_field "$dir/meta.json" app_name)"
  bundle_id="$(json_field "$dir/meta.json" bundle_id)"
  [ -n "$app_name" ] || die "extensions/$slug/meta.json has no app_name"
  case "$app_name" in */*|.*) die "extensions/$slug/meta.json: app_name must not contain '/' or start with '.'" ;; esac

  require_team_id
  echo "==> App name:  $app_name"
  echo "==> Bundle ID: $bundle_id"

  # fresh converter input every time: src + safari overlay, nothing else
  local staging
  staging="$C2S_TMP/staging-$slug/src"
  info "Syncing src/ (+ safari/ overlay) for $slug..."
  sync_staging "$slug" "$staging"

  # regenerate the project from scratch: converter output is disposable
  info "Converting with safari-web-extension-converter..."
  rm -rf "$dir/project"
  mkdir -p "$dir/project"
  xcrun safari-web-extension-converter "$staging" \
    --project-location "$dir/project" \
    --app-name "$app_name" \
    --bundle-identifier "$bundle_id" \
    --macos-only --copy-resources --no-open --no-prompt --force \
    || die "converter failed"

  local project="$dir/project/$app_name/$app_name.xcodeproj"
  [ -d "$project" ] || die "converter did not produce $project"
  normalize_bundle_ids "$project"

  local build_dir log_file
  build_dir="$C2S_TMP/build-$slug"
  log_file="$C2S_TMP/build-$slug.log"

  info "Building..."
  # judge success by the product existing, not by grep's exit code
  set +e
  xcodebuild \
      -project "$project" \
      -scheme "$app_name" \
      -configuration Release \
      -derivedDataPath "$build_dir" \
      -allowProvisioningUpdates \
      DEVELOPMENT_TEAM="$TEAM_ID" \
      CODE_SIGN_STYLE=Automatic \
      build 2>&1 | tee "$log_file" | grep -E "BUILD|error|Cycle"
  set -e

  local app="$build_dir/Build/Products/Release/$app_name.app"
  if [ ! -d "$app" ]; then
    echo "" >&2
    echo "ERROR: build failed. Last 40 lines of full output:" >&2
    tail -40 "$log_file" >&2
    die "build failed — see the output above"
  fi

  info "Verifying signature..."
  codesign --verify --deep --strict "$app" || die "signature check failed — not installing"

  info "Installing to /Applications..."
  # copy first, then swap, so a failed copy never leaves you without the old app
  local staged_app="/Applications/.$app_name.new.app"
  rm -rf "$staged_app"
  mv "$app" "$staged_app" || { rm -rf "$staged_app"; die "could not copy the app to /Applications"; }
  rm -rf "/Applications/$app_name.app"
  mv "$staged_app" "/Applications/$app_name.app" || die "could not move the app into place"
  "$LSREGISTER" -f -R -trusted "/Applications/$app_name.app" 2>/dev/null || true
  rm -rf "$build_dir"

  echo ""
  echo "Done: $slug is installed. Enable it in Safari > Settings > Extensions."

  if [ "$no_launch" != "--no-launch" ]; then
    open -a "/Applications/$app_name.app"
    sleep 2
    open -a Safari
  fi
}

managed_slugs() { # every extensions/<dir> holding a meta.json, sorted
  local d
  for d in "$EXTENSIONS_DIR"/*/; do
    [ -d "$d" ] || continue
    [ -f "$d/meta.json" ] || continue
    basename "$d"
  done | sort
}

adopt_unmanaged() { # give meta.json (and the src/ layout) to extensions/<dir>/ folders dropped in by hand
  local d slug name version tmp item
  for d in "$EXTENSIONS_DIR"/*/; do
    d="${d%/}"; slug="$(basename "$d")"
    [ ! -f "$d/meta.json" ] || continue
    if [ ! -f "$d/src/manifest.json" ]; then
      [ -f "$d/manifest.json" ] || continue
      # bare extension root: move everything under src/ (manifest paths stay relative, so they still resolve)
      tmp="$d/.c2s-src"
      mkdir "$tmp" || die "could not adopt extensions/$slug"
      for item in "$d"/* "$d"/.[!.]*; do
        [ -e "$item" ] && [ "$item" != "$tmp" ] && { mv "$item" "$tmp/" || die "could not move $item"; }
      done
      mv "$tmp" "$d/src" || die "could not adopt extensions/$slug"
      info "Moved extensions/$slug into extensions/$slug/src"
    fi
    name="$(clean_app_name "$(manifest_name "$d/src/manifest.json")")"
    [ -n "$name" ] || name="$(clean_app_name "$slug")"
    version="$(manifest_field "$d/src/manifest.json" version)"
    write_meta "$d/meta.json" "$slug" "$name" "com.converted.$(slugify "$slug")" local - - "${version:-0}"
    info "Adopted extensions/$slug (wrote meta.json: $name, v${version:-0})"
  done
}

resolve_slugs() { # <slug|all> -> slugs to operate on
  local want="${1:-all}"
  if [ "$want" = "all" ]; then
    managed_slugs
    return 0
  fi
  [ -f "$EXTENSIONS_DIR/$want/meta.json" ] || die "no managed extension named '$want' (run: $0 list)"
  printf '%s\n' "$want"
}

# --- commands -------------------------------------------------------------------

cmd_list() {
  local IFS=$'\n'
  local slugs=($(managed_slugs))
  if [ ${#slugs[@]} -eq 0 ]; then
    echo "No extensions yet. Add one:"
    echo "  $0 add <chrome-web-store-url>"
    echo "  $0 add /path/to/unpacked-extension"
    return 0
  fi
  printf '%-18s %-24s %-9s %s\n' "SLUG" "APP" "VERSION" "STATUS"
  local slug app ver overlay installed status
  for slug in "${slugs[@]}"; do
    app="$(json_field "$EXTENSIONS_DIR/$slug/meta.json" app_name)"
    ver="$(json_field "$EXTENSIONS_DIR/$slug/meta.json" upstream_version)"
    overlay=""
    [ -n "$(ls "$EXTENSIONS_DIR/$slug/safari" 2>/dev/null | grep -v '^\.gitkeep$' || true)" ] && overlay="+overlay"
    installed=""
    [ -d "/Applications/$app.app" ] && installed="installed"
    status="$installed$overlay"
    [ -z "$status" ] && status="-"
    printf '%-18s %-24s %-9s %s\n' "$slug" "$app" "$ver" "$status"
  done
}

write_meta() { # <meta-path> <slug> <name> <bundle-id> <origin> <store-url-or-> <extid-or-> <version>
  python3 - "$@" <<'PY'
import json, sys, datetime

path, slug, name, bundle_id, origin, store_url, ext_id, version = sys.argv[1:9]
meta = {
    "slug": slug,
    "app_name": name,
    "bundle_id": bundle_id,
    "origin": origin,
    "store_url": None if store_url == "-" else store_url,
    "extension_id": None if ext_id == "-" else ext_id,
    "upstream_version": version,
    "added": datetime.date.today().isoformat(),
}
with open(path, "w") as f:
    json.dump(meta, f, indent=2)
    f.write("\n")
PY
}

cmd_add() {
  local source="" opt_name="" opt_bundle="" no_install=""
  while [ $# -gt 0 ]; do
    case "$1" in
      --name)       opt_name="${2:-}"; shift 2 ;;
      --bundle-id)  opt_bundle="${2:-}"; shift 2 ;;
      --no-install) no_install="1"; shift ;;
      *) [ -z "$source" ] && source="$1" || die "unexpected argument: $1"; shift ;;
    esac
  done
  [ -n "$source" ] || die "add needs a Chrome Web Store URL or a folder path"

  local source_dir ext_id="" store_url="" url_slug=""
  if [[ "$source" == http*://* ]]; then
    ext_id="$(store_id_from_url "$source")"
    [ -n "$ext_id" ] || die "no extension ID in that URL. Expected a Chrome Web Store link like https://chromewebstore.google.com/detail/<name>/<32-char-id>"
    store_url="$source"
    url_slug="$(url_slug_from_store_url "$source")"
    source_dir="$(crx_fetch "$ext_id")"
  else
    [ -d "$source" ] || die "no such folder: $source"
    [ -f "$source/manifest.json" ] || die "no manifest.json in $source — is this a WebExtension?"
    source_dir="$(cd "$source" && pwd)"
  fi

  local name slug version
  name="$(manifest_name "$source_dir/manifest.json")"
  [ -n "$opt_name" ] && name="$opt_name"
  [ -n "$name" ] || name="$url_slug"
  [ -n "$name" ] || name="$(basename "$source_dir")"
  case "$name" in __MSG_*) name="$url_slug";; esac
  [ -n "$name" ] || name="$(basename "$source_dir")"

  # the name ends up in filesystem paths under /Applications
  name="$(clean_app_name "$name")"
  [ -n "$name" ] || die "could not derive an app name — pass --name"

  slug="$(slugify "${C2S_SLUG:-$name}")"
  [ -n "$slug" ] || die "could not derive a slug from '$name' — pass --name"
  [ -e "$EXTENSIONS_DIR/$slug" ] && die "extensions/$slug already exists"

  version="$(manifest_field "$source_dir/manifest.json" version)"

  local dir="$EXTENSIONS_DIR/$slug"
  mkdir -p "$EXTENSIONS_DIR" "$dir/src" "$dir/safari"
  info "Vendoring source into extensions/$slug/src ..."
  cp -R "$source_dir/." "$dir/src/"
  rm -rf "$dir/src/_metadata" "$dir/src/.git" "$dir/src/.github"
  find "$dir/src" -name '.DS_Store' -delete 2>/dev/null || true

  local bundle_id
  bundle_id="${opt_bundle:-com.converted.$slug}"

  write_meta "$dir/meta.json" "$slug" "$name" "$bundle_id" \
    "$( [ -n "$store_url" ] && echo store || echo local )" \
    "${store_url:--}" "${ext_id:--}" "${version:-0}"

  # anchor commit: marks the pristine upstream so `update` can merge
  # new upstream versions with your future tweak-commits
  if repo_is_git; then
    local rel
    rel="$(ext_rel_path "$slug")"
    git_run add "$rel"
    if ! git_run commit -q -m "[c2s] $slug v${version:-0}" -- "$rel"; then
      info "WARNING: anchor commit failed — update's rebase needs it. Commit manually."
    fi
  fi

  echo "==> Added:     extensions/$slug"
  echo "==> App name:  $name"
  echo "==> Bundle ID: $bundle_id"

  if [ -n "$no_install" ]; then
    echo ""
    echo "Install later with:"
    echo "  $0 install $slug"
    return 0
  fi

  build_and_install_one "$slug"
}

cmd_install() {
  local target="" no_launch=""
  while [ $# -gt 0 ]; do
    case "$1" in
      --no-launch) no_launch="--no-launch"; shift ;;
      *) if [ -z "$target" ]; then target="$1"; shift; else die "unexpected argument: $1"; fi ;;
    esac
  done
  target="${target:-all}"

  if [ "$target" != "all" ]; then
    build_and_install_one "$target" "$no_launch"
    return 0
  fi

  local failed=0 slug any=0
  while IFS= read -r slug; do
    [ -n "$slug" ] || continue
    any=1
    echo ""
    echo "### $slug"
    ( build_and_install_one "$slug" "--no-launch" ) || { failed=1; continue; }
  done < <(resolve_slugs all)
  [ "$any" -eq 1 ] || { echo "Nothing to install — no managed extensions yet."; return 0; }
  if [ "$failed" -eq 0 ] && [ -z "$no_launch" ]; then
    open -a Safari
  fi
  [ "$failed" -eq 0 ] || die "one or more installs failed"
}

cmd_update() {
  local check="" no_install="" target=""
  while [ $# -gt 0 ]; do
    case "$1" in
      --check)      check="1"; shift ;;
      --no-install) no_install="1"; shift ;;
      *) if [ -z "$target" ]; then target="$1"; shift; else die "unexpected argument: $1"; fi ;;
    esac
  done
  target="${target:-all}"

  local failed=0 slug any=0
  while IFS= read -r slug; do
    [ -n "$slug" ] || continue
    any=1
    ( update_one "$slug" "$check" "$no_install" ) || failed=1
  done < <(resolve_slugs "$target")
  [ "$any" -eq 1 ] || { echo "Nothing to update — no managed extensions yet."; return 0; }
  [ "$failed" -eq 0 ] || die "one or more updates failed"
}

update_one() { # <slug> [--check] [--no-install]
  local slug="$1" check="${2:-}" no_install="${3:-}"
  local dir="$EXTENSIONS_DIR/$slug"
  local meta="$dir/meta.json"
  [ -f "$meta" ] || { echo "ERROR: no meta.json for '$slug'" >&2; return 1; }

  local ext_id store_url
  ext_id="$(json_field "$meta" extension_id)"
  store_url="$(json_field "$meta" store_url)"
  [ -n "$ext_id" ] || ext_id="$(store_id_from_url "${store_url:-}")"
  if [ -z "$ext_id" ]; then
    echo "### $slug"
    echo "No upstream recorded (local extension) — nothing to update."
    return 0
  fi

  echo ""
  echo "### $slug"
  local vendored_ver fresh remote_ver
  vendored_ver="$(manifest_field "$dir/src/manifest.json" version)"
  fresh="$(crx_fetch "$ext_id")"
  remote_ver="$(manifest_field "$fresh/manifest.json" version)"

  if [ "$vendored_ver" = "$remote_ver" ]; then
    echo "Up to date ($vendored_ver). Nothing to do."
    return 0
  fi

  echo "Update available:"
  echo "  vendored: $vendored_ver"
  echo "  upstream: $remote_ver"
  local changed
  changed="$(diff -rq "$dir/src" "$fresh" 2>/dev/null | wc -l | tr -d ' ')"
  echo "  changed paths: $changed"
  diff -rq "$dir/src" "$fresh" 2>/dev/null | head -15 | sed 's/^/    /' || true
  [ "$changed" -gt 15 ] && echo "    ..."

  if [ -n "$check" ]; then
    echo "(check only — nothing changed. Apply with: $0 update $slug)"
    return 0
  fi

  if ! repo_is_git; then
    replace_src "$dir" "$fresh"
    meta_set_version "$meta" "$remote_ver"
    echo "WARNING: not a git repo — replaced src/ directly; any edits were overwritten."
    return 0
  fi

  local dirty rel old_head cur_branch old_up tweaks new_up
  rel="$(ext_rel_path "$slug")"
  dirty="$(git_run status --porcelain -- "$rel" || true)"
  [ -n "$dirty" ] && die "'$slug' has uncommitted changes. Commit or stash them first, then re-run update."

  old_head="$(git_run rev-parse HEAD)"
  cur_branch="$(git_run symbolic-ref --short -q HEAD || true)"
  old_up="$(git_run log --format=%H -E --grep='^\[c2s\]' -1 -- "$rel/src" || true)"
  if [ -z "$old_up" ]; then
    die "no '[c2s]' anchor commit found for $slug/src — cannot merge automatically.
Fix by hand: replace extensions/$slug/src with the new version and commit it."
  fi

  # only commits that touch this extension count; the farm holds other extensions too
  tweaks="$(git_run rev-list --count --no-merges "$old_up..$old_head" -- "$rel" || echo 0)"

  if [ "$tweaks" -eq 0 ]; then
    # nobody tweaked this extension yet: just vendor the new upstream
    replace_src "$dir" "$fresh"
    meta_set_version "$meta" "$remote_ver"
    git_run add -A "$rel/src" "$meta"
    git_run commit -q -m "[c2s] $slug v$remote_ver" -- "$rel/src" "$meta" || die "could not commit the new upstream"
    echo "Vendored upstream $remote_ver (you had no local commits for it)."
  else
    # Commit the new upstream on top of the old anchor, then merge it into your
    # branch. Git's 3-way merge keeps your tweaks and leaves every other
    # extension's history alone.
    git_run checkout -q --detach "$old_up" || die "could not check out the anchor commit — commit or stash your other changes, then re-run update."
    replace_src "$dir" "$fresh"
    meta_set_version "$meta" "$remote_ver"
    git_run add -A "$rel/src" "$meta"
    git_run commit -q -m "[c2s] $slug v$remote_ver" -- "$rel/src" "$meta" || die "could not commit the new upstream (you are on a detached HEAD: git checkout ${cur_branch:-$old_head})"
    new_up="$(git_run rev-parse HEAD)"
    git_run checkout -q "${cur_branch:-$old_head}" || die "could not return to ${cur_branch:-$old_head}; the new upstream is commit $new_up"

    echo "Merging upstream $remote_ver into your $tweaks commit(s) ..."
    if ! git_run merge --no-edit -m "Merge upstream $slug v$remote_ver" "$new_up"; then
      cat >&2 <<EOF

Merge stopped on a conflict — your edits and the upstream change touch the
same code. Resolve it in git terms:
  cd $REPO_ROOT
  git status                            # see conflicted files
  # edit files, then:
  git add -A && git commit --no-edit
(or bail out entirely: git merge --abort)
Then re-run: $0 install $slug
EOF
      return 1
    fi
    echo "Merged: your commits sit alongside upstream $remote_ver."
  fi

  if [ -n "$no_install" ]; then
    echo "Skipping install (--no-install). Run: $0 install $slug"
    return 0
  fi
  build_and_install_one "$slug"
}

cmd_ui() {
  adopt_unmanaged
  local ui_src="$REPO_ROOT/ui.swift"
  local ui_bin="$REPO_ROOT/.ui/ChromeToSafari"
  if [ ! -x "$ui_bin" ] || [ "$ui_src" -nt "$ui_bin" ]; then
    info "Compiling the UI (first run only)..."
    mkdir -p "$REPO_ROOT/.ui"
    swiftc -O -parse-as-library "$ui_src" -o "$ui_bin"
  fi
  rm -rf "$C2S_TMP"   # exec skips the EXIT trap
  exec env C2S_SCRIPT="$SCRIPT_PATH" "$ui_bin"
}

# --- dispatch -------------------------------------------------------------------

case "${1:-}" in
  ui|--ui)         cmd_ui ;;
  help|-h|--help)  usage ;;
  "")              usage ;;
  add)             shift; cmd_add "$@" ;;
  list|ls)         adopt_unmanaged; cmd_list ;;
  install)         shift; adopt_unmanaged; cmd_install "$@" ;;
  update)          shift; adopt_unmanaged; cmd_update "$@" ;;
  # legacy muscle-memory: a bare path or URL means "add this"
  *)               cmd_add "$@" ;;
esac
