# chrome-to-safari

Turn any Chrome extension (or any WebExtension) into a working, signed Safari extension — **no paid Apple Developer ID required**.

Safari can run Chrome extensions, but unsigned ones get **disabled every time Safari restarts**, so you're forever re-ticking "Allow unsigned extensions" in the Develop menu. This tool signs the extension with a **free** Apple ID, so once you enable it in Safari it stays enabled for good.

This repo is also the **farm**: every extension you convert lives here as source, so you can edit it, keep Safari-only tweaks separate, replay your edits when the upstream extension updates, and clone the whole farm to another Mac and reinstall with one command.

## Demo

https://github.com/user-attachments/assets/44111fd5-4475-4d19-8c9f-11b571000dcc

## The model

Each managed extension lives in `extensions/<slug>/`:

```
extensions/
└── <slug>/
    ├── src/        # ← THE Chrome source. Edit here. Always.
    │               #   For store forks: pristine upstream + your changes
    │               #   as git commits on top of an "[c2s]" anchor commit.
    ├── safari/     # optional overlay, copied over src/ at build time:
    │               #   any file here replaces/added-to src/,
    │               #   manifest.patch.json deep-merges into manifest.json.
    │               #   Use for Safari-only shims, keys, permissions.
    ├── meta.json   # app name, bundle id, store origin + version
    └── project/    # GENERATED converter output — disposable. Rebuilt from
                    # scratch on every install; gitignored; NEVER edit here.
```

The rule that kills all confusion: **`src/` (+ `safari/`) is the only place edits live.** `project/` is regenerated from them on every install, so nothing you do anywhere else can ever be lost or go stale.

## Quick start

**1. Get a free signing certificate** (one time, about two minutes):

1. Open **Xcode → Settings → Accounts**
2. Click **+** and sign in with your Apple ID — no paid membership needed
3. Select your account → **Manage Certificates…** → **+** → **Apple Development**

**2. Open the app:**

```bash
./chrome-to-safari.sh ui
```

Two tabs:

- **Extensions** — everything under `extensions/`, with installed/version status. One click to **Install**, one to **Check** for upstream updates, plus **Install All** and **Check All Updates**.
- **Add** — paste a Chrome Web Store link or drop an unpacked folder; the extension is vendored into `extensions/<slug>/`, converted, built, signed, installed.

The app builds itself from [ui.swift](ui.swift) on first run using the Xcode tools you already have. Nothing is downloaded, so there are no Gatekeeper warnings.

## Command line

```bash
# Add from a store link (vendored + converted + built + installed)
./chrome-to-safari.sh add "https://chromewebstore.google.com/detail/<name>/<id>"

# Add from a local unpacked folder
./chrome-to-safari.sh add /path/to/extension --no-install

# See what's in the farm
./chrome-to-safari.sh list

# Install (syncs src/+safari/, regenerates project/, builds, signs, installs)
./chrome-to-safari.sh install <slug>
./chrome-to-safari.sh install all

# Upstream updates for store forks — check first, then apply
./chrome-to-safari.sh update <slug> --check   # version delta + changed paths, touches nothing
./chrome-to-safari.sh update <slug>           # vendors new upstream, merges it with your commits
```

Typing an old-style bare path or URL without a verb is shorthand for `add`.

## Editing an extension

Edit files in `extensions/<slug>/src/`. Then rebuild and reinstall:

```bash
./chrome-to-safari.sh install <slug>
```

You can test-drive logic quickly in Chrome while iterating: load `src/` unpacked at `chrome://extensions`, tweak, hit reload — seconds per cycle. When it feels right, one `install` brings it into Safari.

## Safari-specific tweaks (`safari/` overlay)

Anything that exists *only* for Safari goes in `extensions/<slug>/safari/` instead of polluting the Chrome source:

- **Whole files**: a file at `safari/content.js` replaces `src/content.js`; `safari/shim.js` is added outright.
- **Manifest keys**: `safari/manifest.patch.json` is deep-merged over the staged `manifest.json` — e.g. swap `background.service_worker` for a Safari-compatible variant or request extra permissions:

  ```json
  { "background": { "scripts": ["background.js"] } }
  ```

At build time the script stages `src/`, copies the overlay over it, applies the patch, and feeds the result to Apple's converter. Chrome never sees the overlay; Safari always gets it.

## Updating a forked extension

For extensions vendored from the Chrome Web Store, your history looks like:

```
[c2s] slug v1.2.0        ← pristine upstream (anchor commit, made by `add`)
├─ your fix A            ← ordinary commits you made
└─ your fix B
```

When the original author ships something cool:

```bash
./chrome-to-safari.sh update slug --check   # what changed? is it worth it?
./chrome-to-safari.sh update slug           # apply it
```

`update` commits the new upstream on top of the old anchor, then merges it into your branch, so your commits stay and other extensions' history is untouched. If your edit and the upstream change touch the same lines, it stops and tells you exactly how to finish in git terms (`git status` → edit → `git add -A && git commit --no-edit`). `git merge --abort` restores the exact pre-merge state.

Local extensions (no upstream) simply report "nothing to update".

## Syncing to another Mac

Signing is per-machine (each Mac must sign with its own free certificate), so machines share **source**, never built apps. Since the whole farm *is* this repo:

```bash
# --- Machine B (one time) ---
git clone <this-repo-url>
cd chrome-to-safari
./chrome-to-safari.sh install all
```

That's it — every managed extension is rebuilt from committed source, signed locally, and installed. Bundle IDs come from each `meta.json`, so settings and permissions survive the trip.

## Requirements

- macOS with **Xcode** installed (the full app, not just Command Line Tools — the converter and build need it)
- A free Apple Development certificate (the one-time step above). The script auto-detects it on every run; if it's missing, it stops and prints these same instructions.

## What `install` does, step by step

1. **Stages** `src/` + the `safari/` overlay into a temp dir (applying the manifest patch).
2. **Converts** with Apple's `xcrun safari-web-extension-converter` into a fresh `project/` (the old one is replaced — it holds no edits by design).
3. **Fixes a converter quirk**: normalizes mismatched bundle identifiers ("Embedded binary's bundle identifier is not prefixed…") so the build doesn't break.
4. **Builds** with `xcodebuild`, injecting your team ID so both targets are signed with your free certificate.
5. **Verifies** the code signature.
6. **Installs** to `/Applications`, registers with Launch Services, and opens the app + Safari.

No step deletes anything you could have edited. Re-running is always safe.

## Options

| Env var         | Default                          | Purpose                                            |
|-----------------|----------------------------------|----------------------------------------------------|
| `TEAM_ID`       | auto-detected from your keychain | Apple team ID (if you have several certificates)   |
| `C2S_EXTENSIONS`| `<repo>/extensions`              | Where the farm lives                               |

`add` flags: `--name`, `--bundle-id` override what's read from the manifest; `--no-install` skips building.

## Limitations

- **Signing is per-machine.** A development-signed app only counts as signed on the Mac that built it. You can't distribute the built app to other people — they should clone this repo and run `install` themselves. Public distribution requires a paid Apple Developer account and notarization; nothing scriptable gets around that.
- **Not every Chrome API exists in Safari.** The converter warns about unsupported `manifest.json` keys during conversion — read its output. Check [Safari's WebExtension API support](https://developer.apple.com/documentation/safariservices/safari_web_extensions) for details. Safari-only fixes belong in the `safari/` overlay.
- **Free certificates expire after about a year.** Re-run `install` to re-sign when that happens.

## Troubleshooting

- **"No Apple Development certificate found"** — do the one-time setup above.
- **Extension doesn't appear in Safari** — quit and reopen Safari, then check Safari → Settings → Extensions. Make sure the wrapper app ran at least once.
- **Multiple certificates / wrong team** — pass `TEAM_ID=XXXXXXXXXX` explicitly. Find yours with `security find-identity -v -p codesigning`.
- **Update stopped on a conflict** — that's the system working. Follow the printed steps: resolve, then `git add -A && git commit --no-edit` (or `git merge --abort`).

## Privacy & Terms

- [Privacy Policy](PRIVACY.md) — nothing collected, nothing transmitted
- [Terms of Use](TERMS.md) — MIT, as-is, no warranty

## License

MIT — see [LICENSE](LICENSE).
