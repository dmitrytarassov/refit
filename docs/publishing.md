# Publishing `refit-core` to npm

Releases are cut by pushing a version tag; GitHub Actions builds, tests and publishes. The CLI (`packages/refit-cli`) is a private workspace for now and is not published — shipping it as `refit-cli` with a `refit` bin is a separate, later step.

## One-time setup

Publishing uses npm **trusted publishing** (OIDC): npm trusts this repository + the `publish.yml` workflow and mints a short-lived token per run. No npm token is stored in GitHub, so there is nothing to leak or rotate.

1. **First release by hand** — a trusted publisher can only be configured on a package that already exists:
   ```bash
   npm login                      # account with 2FA (passkey / hardware key)
   bun run --filter refit-core build
   cd packages/refit-core && npm publish --access public   # asks for the OTP
   ```
2. npmjs.com → package `refit-core` → Settings → **Trusted Publisher** → GitHub Actions: owner `dmitrytarassov`, repository `refit`, workflow filename `publish.yml`, environment `npm`.
3. Same page → **Publishing access** → "Require two-factor authentication and disallow tokens". From now on only the OIDC workflow and a human with an OTP can publish; any leaked token is useless.
4. GitHub → repository Settings → Environments → create `npm`; optionally add yourself as a required reviewer and restrict the deployment branches/tags to `v*`. The job waits for approval before it can publish.

The workflow runs with `permissions: {}` at the top level and grants only `contents: read` + `id-token: write` to the publish job; every action is pinned to a commit SHA. Provenance is attached automatically (`--provenance`), so the npm page links back to the exact commit and run.

## Release flow

```bash
# 1. bump the version (semver) and commit
#    packages/refit-core/package.json → "version": "0.2.0"
git commit -am "release: refit-core 0.2.0"

# 2. tag and push — the tag must equal "v" + package version
git tag v0.2.0
git push origin main --tags
```

`.github/workflows/publish.yml` (on `push` of a `v*` tag):

1. `bun install --frozen-lockfile`, `bun run lint`, `bun run typecheck`, `bun test`;
2. `bun run --filter refit-core build` → `packages/refit-core/dist/`;
3. guard: the tag must match the package version, otherwise the job fails before publishing;
4. `npm install -g npm@latest` (trusted publishing needs npm ≥ 11.5.1), `bun pm pack` → tarball, then `npm publish <tarball> --provenance --access public` (npm is used only here — `bun publish` has no OIDC/provenance support).

## Checking a release locally

```bash
bun test && bun run typecheck && bun run lint
bun run --filter refit-core build
cd packages/refit-core && bun pm pack --destination /tmp/refit-pack && tar -tzf /tmp/refit-pack/refit-core-*.tgz
npm publish /tmp/refit-pack/refit-core-*.tgz --dry-run --access public
```

The tarball must contain `dist/**`, `src/**`, `package.json`, `README.md`, `LICENSE` and nothing from `test/`. To try the package as a consumer, `bun add /tmp/refit-pack/refit-core-*.tgz` in a scratch project and import from all three entries (`refit-core`, `refit-core/fit`, `refit-core/node`) — both `tsc --noEmit` under `module: nodenext` and a plain `node` import should work.
