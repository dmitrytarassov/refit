# Web app (`src/`)

An SPA on Vite + React 19 (React Compiler via babel-plugin) on top of `lib`. **No backend, no auth**: the whole pipeline — FIT decode, track cleaning, power calculation — runs right in the browser; history is stored in IndexedDB ([history-storage.md](history-storage.md)). Charts — Recharts, icons — lucide-react, routing — react-router-dom, map — Leaflet (react-leaflet, OpenStreetMap tiles).

Run: `bun run dev`, build: `bun run build`, lint: `bun run lint`.

Deploy: GitHub Pages via `.github/workflows/deploy.yml` (push to `main` → build → `actions/deploy-pages`, site at `https://dmitrytarassov.github.io/refit/`). The workflow passes `BASE_PATH=/refit/` to the build; `vite.config.ts` reads it into `base`, and `BrowserRouter` gets `basename={import.meta.env.BASE_URL}` — both are required for a project-pages subpath, or the site loads blank / links escape to the domain root.

The bundle is sliced into chunks: heavy dependencies don't load until needed. `@garmin/fitsdk` is pulled in via dynamic `import()` inside `decodeActivity` (`use-fit-processing`) and `use-enhance-download`; recharts with all the dashboard cards — via `React.lazy(ActivityDashboard)` in `DashboardPanel` (rendered only in the `ready` status, fallback — "Loading dashboard…"); Leaflet is another lazy boundary inside `ActivityDashboard` (`RouteMapCard`, fallback `null`).

## Navigation

react-router-dom, but without `<Routes>`: the only path is `/`, and "pages" switch via query parameters (`App.tsx` reads them through `useSearchParams`):

| URL | What it shows |
| --- | --- |
| `/` | dashboard: sidebar with UploadZone + ride panel |
| `/?record=id` | the same main page, but the file is taken from IndexedDB by id |
| `/?record=id&tab=…` | dashboard tabs: `power`, `performance`, `map`, `data-quality` (`tab` is absent for Overview) |
| `/?view=history` | the History page (table of saved rides) |
| `/?view=help` | the Help page — formulas for all calculations (cleaning, power, metrics) |
| `/?view=settings` | the Settings page — default power calculation settings (`settings` store) |

Navigation is client-side (`<Link>` in `AppHeader` and `HistoryPage`), no page reload; back/forward work through `useFitProcessing` reacting to `?record` changes. `AppHeader` — Dashboard/History/Help/Settings links, theme switcher (`ThemeToggle` writes `data-theme` on `<html>`, palette — [theme.md](theme.md)), and external icon links: GitHub (repo) and Telegram (@refit_app).

## Data flow

The central hook is `use-fit-processing.ts`:

1. `UploadZone` (drag-n-drop or file picker) hands a `File` to `processFile`.
2. `decodeFit` → `cleanTrack` → `estimatePower` → `sessionPowerStats` — assembling an `Activity` object (`src/types/activity.ts`: fit, records, verdicts, report, powers, powerStats, settings). Calculation settings (`RideSettings`: position + Crr parameters) come from the ride's row, otherwise the last saved ones from the `settings` store, otherwise the `POWER_DEFAULTS` defaults; mass is always from defaults for now.
3. If no file with that name is in the database — `saveRide`; the URL gets `?record=id` (`setSearchParams` with `replace`).
4. The hook watches `?record` (`useSearchParams`): when an id appears or changes, the buffer is taken from the database and run through the same `decodeActivity`; a ref with the current id guards against re-processing a just-saved file; leaving `?record` resets the state to `idle`.
5. The eraser icon (`ClearButton` in `FileHeaderCard`): for a saved ride (`?record` present) it opens a popup — "Also delete this ride from History?" with Delete (`discard()`: `deleteRide` + reset) and Keep (`reset()` only — the ride stays in History). Example rides are not saved, so the eraser clears the dashboard immediately without asking. `reset()` sets the state to `idle` and removes `?record` from the URL.

State is the discriminated union `ProcessingState` (`idle | processing | error | ready`), which `DashboardPanel` uses to pick what to render.

The **Download enhanced** button (`FileHeaderCard` → `DownloadMenu` → `use-enhance-download.ts`) opens a dropdown with switches for what gets written: cleaned coordinates and estimated power, plus a Save button. If the file has power from a real sensor, the power switch is **off by default** — the original values are kept, and estimated power is written only on explicit opt-in. Enhancements are applied to a `structuredClone` of `fit.ordered` (the in-memory activity is never mutated by a download), then `applyEnhancements` (no smoothing) + `encodeFit`, download via a blob link as `<name>.enhanced.fit`. Note: the CLI writes `<name>.out.fit` — the suffixes differ.

## Structure

| Directory | Contents |
| --- | --- |
| `components/layout/` | `AppHeader`, `ThemeToggle` |
| `components/sidebar/` | `SidebarPanel`: heading, `UploadZone`, How it works / What you get promo cards |
| `components/dashboard/` | `DashboardPanel` (routing by `ProcessingState`, lazy boundary), `ActivityDashboard` (header cards + tabs, switches content by `?tab`), `OverviewTab` (tiles, charts, bottom row, map), `PowerTab` (power tiles incl. Intensity Factor + power chart with zones + power curve), `PerformanceTab` (HR/cadence/elevation charts + Training Load), `MapTab` (full-width route map), `DataQualityTab` (`DataQualityCard` + `FileDataCard` — raw mesg counts, fileId/session key-values, decode errors; the "View Raw Data" button in `FileHeaderCard` navigates here), `DashboardTabs` (state in `?tab` via `useSearchParams`; only Intervals is a stub), `FileHeaderCard`, `MetricTilesRow`, `EmptyState`. Computed metric tiles (Avg/NP/Max Power, Est. FTP, IF, TSS) carry a `?` HelpTip in the corner with a one-line "how it's computed" — texts live in `metric-help.ts`, shared by Overview and Power; self-evident tiles (Duration, Distance) have none. Keep the texts in sync with docs/Help/README when formulas change (+ example buttons from `example-files.ts`: the demo ride is served from `public/examples/`, the Garmin sample is fetched from their GitHub at click time; both open via `processUrl` and are **not** saved to History) |
| `components/charts/` | Recharts cards: Power, HeartRate, Cadence, Elevation + `PowerZonesPanel` |
| `components/bottom/` | `PowerCurveCard`, `DataQualityCard`, `TrainingLoadCard` |
| `components/history/` | `HistoryPage` — table built from `RideRow` columns, no FIT parsing |
| `components/help/` | `HelpPage` + sections `TrackCleaningHelp` / `PowerModelHelp` / `MetricsHelp` — static reference with formulas; content is a digest of [track-cleaning.md](track-cleaning.md), [power-estimation.md](power-estimation.md), [ftp-estimation.md](ftp-estimation.md); update together with the docs when algorithms change |
| `components/power-settings/` | `PowerSettingsBar` (strip below `FileHeaderCard`: selected position/surface/tires/pressure + a gear icon) and `PowerSettingsPanel` (selects, reused on Settings); changing a value → `updateSettings` from `use-fit-processing` |
| `components/settings/` | `SettingsPage` — power calculation defaults for new rides (`usePowerSettings` + the shared `PowerSettingsPanel`) and the manual FTP field (`useManualFtp`, clearable) |
| `components/map/` | `RouteMapCard` — full-width route map below the cards: Leaflet + OSM tiles, polyline over accepted points; the cleaned route is drawn in the palette's `success` green; a "Show Original" switch in the card header (shown only when cleaning rejected points) overlays the raw track in red (`heartRate`) underneath it; in dark theme tiles are dimmed with a CSS filter. `MapPinchZoom` — pinch zoom on a trackpad (ctrl+wheel, `zoomSnap={0}`); regular two-finger scroll is not intercepted. The "Leaflet" prefix in the attribution is hidden, the OSM copyright is kept (a condition of their tile policy) |
| `components/**/ui/` | styled-only components: `ChartCard`, `ChartTooltip`, `MetricTile`, `QualityRing`, `HelpTip`, `ToggleSwitch`, `AppLogo` (inline-SVG wordmark; theme colors via `--logo-*` CSS variables switched on `data-theme`) |
| `hooks/` | all fetching and computation (see below) |
| `db/` | IndexedDB layer — [history-storage.md](history-storage.md) |
| `types/` | `Activity`, `ProcessingState`, chart, metric, and theme types |
| `fit/` | UI helpers: `power-defaults.ts` (power model parameters for the web), `format-metrics.ts`, `downsample-points.ts` (cap of 2000 points per chart) |
| `charts/` | chart palette and tick formatter |
| `styles/`, `theme/` | `theme.css` and `ThemeContext` |

CSS — plain files next to the component (`Component.tsx` + `Component.css`), no CSS-in-JS.

## Hooks

Components are pure render; computation lives in hooks:

| Hook | What it does |
| --- | --- |
| `use-fit-processing` | file or `?record=id` → `Activity`, saving to history; `processUrl` — fetch + decode a file by URL without saving (example rides); `updateSettings` — recompute power/metrics on settings change and autosave ([history-storage.md](history-storage.md)) |
| `use-activity-summary` | meta (sport, date, device) and metrics for the tiles |
| `use-power-series`, `use-record-series` | power/HR/cadence/elevation time series with downsampling |
| `use-power-settings` | last calculation settings from the `settings` store: read on mount, write on change |
| `use-power-curve` | power curve (`lib/power/power-curve`) |
| `use-route-points` | accepted point coordinates in degrees for the map (with downsampling) |
| `use-ftp` | the FTP the app runs on: manual from Settings wins, otherwise the estimate from the curve; returns `{ watts, source }` ([ftp-estimation.md](ftp-estimation.md)) |
| `use-manual-ftp` | manual FTP from the `settings` store: read on mount, save/delete on change |
| `use-power-zones`, `use-tss` | zones and TSS on top of FTP |
| `use-enhance-download` | encodes and downloads the enhanced file |
| `use-ride-history` | ride list for History + `remove(id)` (optimistic delete, [history-storage.md](history-storage.md)) |
| `use-theme-state`, `use-theme` | theme state and context access |

## Stubs (laid out, not implemented)

- The Intervals tab in `DashboardTabs` (`aria-disabled`).
- `TrainingLoadCard` — a "needs several rides" placeholder.
