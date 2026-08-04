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

## Metrics (FTP is estimated from the recording as a lower bound — see docs/ftp-estimation.md; manual FTP in settings — later)

- [ ] Intensity Factor — the tile was removed (2026-08-04) in favor of Est. FTP; think about where to bring IF back (tooltip on TSS? Training Load?). IF = NP / FTP is already trivial on top of `useFTP`.
- [x] TSS — computed (`useTSS` on top of the estimated FTP); since FTP is a lower bound, TSS is an upper estimate.
- [x] Power Zones — panel is live (`usePowerZones`): Coggan zones from the estimated FTP, % of time in each zone.
- [ ] Power Curve: the "Your Best" line — comparison against best efforts from past rides; requires history storage (localStorage/IndexedDB, ~30 numbers per ride, max aggregation), will land together with History. The "This Ride" curve is already done.
- [ ] Training Load — mock card; will fill in after TSS/IF (+ calories from the device's session mesg, if present).

## UI

- [ ] Power / Performance / Intervals / Map / Data Quality tabs — currently inactive stubs. Nearest candidate is Data Quality: a detailed cleaning report (the data from `cleanTrack` is already there). Map — the track on a map with rejected/smoothed points highlighted; a basic route map already exists on Overview (`RouteMapCard`, 2026-08-04), the tab is left with the detail view (point highlighting, before/after cleaning comparison).
- [ ] "View Raw Data" — mock button; a viewer for raw FIT messages (fileId, session, records).
- [ ] Kebab menu on the file card — mock; options: reset file, copy report, processing settings.
- [ ] Header navigation: Dashboard, History, Help and Settings are live (`?view=…`); the avatar is a static mock. Help (2026-08-04) — formulas for all calculations, keep in sync with docs when algorithms change. Settings (2026-08-04) — power calculation defaults; candidates to add: mass, `--smooth`, manual FTP.
- [ ] Processing settings before "Enhance & Download": `--smooth` and bike/rider mass are still hardcoded (smooth off, mass from defaults). Riding position (CdA) and Crr (surface/tires/pressure) are done (2026-08-04): `PowerSettingsBar` under the file card, persisted to the database (ride row + last-used values), metrics recomputed on the fly.
