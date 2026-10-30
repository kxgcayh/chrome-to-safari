#!/bin/bash
# `update` must keep this extension's tweak and leave other extensions' history alone.
set -euo pipefail
T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT
export GIT_AUTHOR_NAME=t GIT_AUTHOR_EMAIL=t@t GIT_COMMITTER_NAME=t GIT_COMMITTER_EMAIL=t@t
ID=aaaaaaaabbbbbbbbccccccccdddddddd
R="$T/repo"; mkdir -p "$R/extensions" "$T/bin"
cp "$(dirname "$0")/../chrome-to-safari.sh" "$R/"
cd "$R"; git init -q -b main

for x in a b; do
  mkdir -p extensions/$x/src
  echo '{"version":"1.0"}' > extensions/$x/src/manifest.json
  echo orig > extensions/$x/src/code.js
  printf '{"app_name":"%s","extension_id":"%s","upstream_version":"1.0"}\n' $x $ID > extensions/$x/meta.json
  git add . && git commit -qm "[c2s] $x v1.0"
done
echo tweak > extensions/a/src/code.js && git commit -qam "tweak a"
echo tweak > extensions/b/src/code.js && git commit -qam "tweak b"

# fake store: curl copies a prepared v2.0 zip to the -o target
mkdir "$T/up"; echo '{"version":"2.0"}' > "$T/up/manifest.json"; echo orig > "$T/up/code.js"
(cd "$T/up" && zip -q ../v2.zip manifest.json code.js)
printf '#!/bin/bash\nwhile [ $# -gt 0 ]; do [ "$1" = -o ] && cp "%s/v2.zip" "$2"; shift; done\n' "$T" > "$T/bin/curl"
chmod +x "$T/bin/curl"

PATH="$T/bin:$PATH" ./chrome-to-safari.sh update a --no-install >/dev/null

fail() { echo "FAIL: $*"; exit 1; }
grep -q '"2.0"' extensions/a/src/manifest.json || fail "a not updated"
grep -q tweak extensions/a/src/code.js           || fail "a lost its tweak"
grep -q tweak extensions/b/src/code.js           || fail "b changed"
[ -n "$(git log --format=%s --grep='^tweak b$')" ] || fail "b's commit lost from history"
[ "$(git symbolic-ref --short HEAD)" = main ]    || fail "not on main"
echo OK
