# TODO

## Integrations

- [ ] Garmin Connect — downloading rides into the app. There is no official API for third-party SPAs (partner program + push model), and the unofficial one (SSO + cookies, like garth / npm garmin-connect) is unreachable from the browser: CORS + third-party cookies, Origin can't be forged. Works only from a server environment. Constraint: hosting is GitHub Pages, don't want to run our own server. Options (2026-08-04):
  1. Free serverless (Cloudflare Workers) with `/api/garmin/*` — the closest thing to "no server"; risks: Garmin's anti-bot on datacenter IPs, other people's passwords going through our worker if the tool is public.
  2. Browser extension with a host permission for garmin.com — rides on the user's existing session, never touches passwords; the cleanest option for public static hosting, but a separate artifact (write it, maintain it, install it).
  3. Local companion (a `bun` process on localhost that the Pages static site talks to) — fine for personal use.
  4. Status quo: manual `.fit` export + drag-n-drop.
  No decision made. Uploading the enhanced file back to Garmin — open question. A garmin client shared by CLI and web — as a separate module; only it talks to the Garmin API.
- [ ] Strava — official public API, self-service app registration, OAuth 2.0 (the user's password never passes through us). Notes (2026-08-04):
  - Server-side code is still unavoidable: `/oauth/token` requires client_secret and has no CORS, no PKCE — need a microproxy (~50 lines, Cloudflare Workers) that is trusted with the app secret only; safe for a public tool. API endpoints are also behind CORS — proxy them.
  - The API doesn't return the original `.fit` — only streams (time/latlng/altitude/HR/cadence/watts). A `FitRecord` can be assembled from them and run through the pipeline, but it's a reconstruction: device info, laps, events are lost; activities with privacy zones have their coordinates trimmed.
  - File upload to Strava is first-class (`POST /uploads` accepts `.fit`): the "push enhanced ride to Strava" scenario is fully doable through official channels.
  - Bottom line: Strava is good for "push enhanced" and "pull a ride for analysis"; for "clean the original file" the source remains manual export or the Garmin options above.

## Technical

- [x] Cut the bundle with code splitting (2026-08-04): entry ~254 KB (82 KB gzip) instead of ~1043 KB in one chunk. Garmin SDK — dynamic `import()` in `decodeActivity` / `useEnhanceDownload` (chunk loads after file selection); recharts and all the cards — `React.lazy(ActivityDashboard)` on the ready branch of `DashboardPanel`.

## Metrics (FTP: manual value from Settings wins, otherwise estimated from the recording as a lower bound — see docs/ftp-estimation.md; manual FTP done 2026-08-05)

- [x] Intensity Factor — back as a tile on the Power tab (2026-08-05), computed as NP / estimated FTP in `PowerTab`.
- [x] TSS — computed (`useTSS` on top of the estimated FTP); since FTP is a lower bound, TSS is an upper estimate.
- [x] Power Zones — panel is live (`usePowerZones`): Coggan zones from the estimated FTP, % of time in each zone.
- [ ] Power Curve: the "Your Best" line — comparison against best efforts from past rides; requires history storage (localStorage/IndexedDB, ~30 numbers per ride, max aggregation), will land together with History. The "This Ride" curve is already done.
- [ ] Training Load — mock card; will fill in after TSS/IF (+ calories from the device's session mesg, if present).

## UI

- [ ] Intervals tab — the only inactive stub left (Power / Performance / Map / Data Quality are live since 2026-08-05, state in `?tab`). Map tab still owes the detail view: rejected/smoothed points highlighted, before/after cleaning comparison.
- [x] "View Raw Data" — navigates to the Data Quality tab (2026-08-05): `FileDataCard` shows mesg counts, fileId/session key-values, decode errors. A per-record viewer for `recordMesgs` — later, if needed.
- [x] Kebab menu on the file card — replaced (2026-08-05) with a direct "clear dashboard" eraser icon (`reset()` in `use-fit-processing`); the other kebab ideas (copy report) dropped for now.
- [x] Header navigation: Dashboard, History, Help and Settings are live (`?view=…`); the avatar mock replaced with GitHub + Telegram icon links (2026-08-05). Help (2026-08-04) — formulas for all calculations, keep in sync with docs when algorithms change. Settings (2026-08-04) — power calculation defaults; manual FTP and rider/bike weight added 2026-08-05; candidate to add: `--smooth`.
- [ ] Processing settings before "Download enhanced": `--smooth` is still hardcoded off. Riding position (CdA) and Crr (2026-08-04) — `PowerSettingsBar` under the file card, persisted (ride row + last-used), metrics recomputed on the fly. Rider/bike mass (2026-08-05) — global Settings value (`mass` key), defaults 82/8 with a dashboard reminder; applies on the next ride load, not live.
