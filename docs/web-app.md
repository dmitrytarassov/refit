# Web app (`src/`)

An SPA on Vite + React 19 (React Compiler via babel-plugin) on top of `lib`. **No backend, no auth**: the whole pipeline — FIT decode, track cleaning, power calculation — runs right in the browser; history is stored in IndexedDB ([history-storage.md](history-storage.md)). Charts — Recharts, icons — lucide-react, routing — react-router-dom, map — Leaflet (react-leaflet, OpenStreetMap tiles).

Run: `bun run dev`, build: `bun run build`, lint: `bun run lint`.

Deploy: GitHub Pages via `.github/workflows/deploy.yml` (push to `main` → build → `actions/deploy-pages`, site at `https://dmitrytarassov.github.io/refit/`). The site serves two LLM-discovery files: `/llms.txt` (hand-written overview + doc links, lives in `public/`) and `/llms-full.txt` (README + all docs in one file, generated into `dist/` by `scripts/build-llms-full.ts` as the last build step). The workflow passes `BASE_PATH=/refit/` to the build; `vite.config.ts` reads it into `base`, and `BrowserRouter` gets `basename={import.meta.env.BASE_URL}` — both are required for a project-pages subpath, or the site loads blank / links escape to the domain root.

The bundle is sliced into chunks: heavy dependencies don't load until needed. `@garmin/fitsdk` is pulled in via dynamic `import()` inside `decodeActivity` (`use-fit-processing`) and `use-enhance-download`; recharts with all the dashboard cards — via `React.lazy(ActivityDashboard)` in `DashboardPanel` (rendered only in the `ready` status, fallback — "Loading dashboard…"); Leaflet is another lazy boundary inside `ActivityDashboard` (`RouteMapCard`, fallback `null`).

## Navigation

react-router-dom, but without `<Routes>`: the only path is `/`, and "pages" switch via query parameters (`App.tsx` reads them through `useSearchParams`):

| URL | What it shows |
| --- | --- |
| `/` | dashboard: sidebar with UploadZone + ride panel |
| `/?record=id` | the same main page, but the file is taken from IndexedDB by id |
| `/?record=id&tab=…` | dashboard tabs: `power`, `performance`, `map`, `data-quality` (`tab` is absent for Overview) |
| `/?view=history` | the History page (table of saved rides; ride cards on mobile) |
| `/?view=help` | the Help page — formulas for all calculations (cleaning, power, metrics) |
| `/?view=settings` | the Settings page — default power calculation settings (`settings` store) |

Navigation is client-side (`<Link>` in `AppHeader` and `HistoryPage`), no page reload; back/forward work through `useFitProcessing` reacting to `?record` changes. `AppHeader` — Dashboard/History/Help/Settings links, theme switcher (`ThemeToggle` writes `data-theme` on `<html>`, palette — [theme.md](theme.md)), and external icon links: GitHub (repo) and Telegram (@refit_app).

## Data flow

The central hook is `use-fit-processing.ts`:

1. `UploadZone` (drag-n-drop or file picker) hands a `File` to `processFile`.
2. `decodeFit` → `cleanTrack` → `estimatePower` → `sessionPowerStats` — assembling an `Activity` object (`src/types/activity.ts`: fit, records, verdicts, report, powers, powerStats, settings). Calculation settings (`RideSettings`: position + Crr parameters + optional rider/bike mass) come from the ride's row, otherwise the last saved ones from the `settings` store, otherwise the `POWER_DEFAULTS` defaults; a missing mass is filled from the Settings default (`mass` key) via `resolveRideSettings` and snapshotted into the ride row on save. Per-ride weights are editable in the gear panel (`RideMassFields`); when neither the ride nor Settings has a mass, defaults (rider 82 kg, bike 8 kg, gear 2 kg) are used and `DefaultMassAlert` points to both Settings and the per-ride gear panel. Changing the Settings default applies to newly loaded rides (and, as a fallback, to old rides without a stored mass on their next load).
3. If no file with that name is in the database — `saveRide`; the URL gets `?record=id` (`setSearchParams` with `replace`).
4. The hook watches `?record` (`useSearchParams`): when an id appears or changes, the buffer is taken from the database and run through the same `decodeActivity`; a ref with the current id guards against re-processing a just-saved file; leaving `?record` resets the state to `idle`.
5. The eraser icon (`ClearButton` in `FileHeaderCard`): for a saved ride (`?record` present) it opens a popup — "Also delete this ride from History?" with Delete (`discard()`: `deleteRide` + reset) and Keep (`reset()` only — the ride stays in History). Example rides are not saved, so the eraser clears the dashboard immediately without asking. `reset()` sets the state to `idle` and removes `?record` from the URL.

State is the discriminated union `ProcessingState` (`idle | processing | error | ready`), which `DashboardPanel` uses to pick what to render.

The **Download enhanced** button (`FileHeaderCard` → `DownloadMenu` → `use-enhance-download.ts`) opens a dropdown with switches for what gets written: cleaned coordinates and estimated power, plus a Save button. If the file has power from a real sensor, the power switch is **off by default** — the original values are kept, and estimated power is written only on explicit opt-in. Enhancements are applied to a `structuredClone` of `fit.ordered` (the in-memory activity is never mutated by a download), then `applyEnhancements` (no smoothing) + `encodeFit`, download via a blob link as `<name>.enhanced.fit`. Note: the CLI writes `<name>.out.fit` — the suffixes differ.

## Structure

| Directory | Contents |
| --- | --- |
| `components/layout/` | `AppHeader`, `ThemeToggle`, `LanguagePickerModal` (first-run language choice — [i18n.md](i18n.md)), mobile navigation (≤640px): `MobileNav` (open/close state) renders `MobileNavBar` — a fixed bottom bar with Home/History/Settings icons + a burger button — and `MobileNavDrawer` — a bottom sheet with all links as text (Dashboard, History, Settings, Help, GitHub, Telegram) plus `ThemeToggle` in its footer. On mobile the header is hidden entirely — the bottom bar + drawer replace it |
| `components/sidebar/` | `SidebarPanel` (brand block + `UploadZone`; on mobile the brand title and tagline sit in one row) and `SidebarInfoCards` (How it works / What you get promo cards) — separate grid children of `.app-body` (areas `sidebar` / `extras`), so on mobile the cards move below the main content |
| `components/dashboard/` | `DashboardPanel` (routing by `ProcessingState`, lazy boundary), `ActivityDashboard` (header cards + tabs, switches content by `?tab`), `OverviewTab` (tiles, power chart, a single `dashboard-card-grid` with the six metric/quality cards, map), `PowerTab` (power tiles incl. Intensity Factor + power chart with zones + power curve), `PerformanceTab` (HR/cadence/elevation/speed charts), `MapTab` (full-width route map), `DataQualityTab` (`DataQualityCard` + `FileDataCard` — raw mesg counts, fileId/session key-values, decode errors; the "View Raw Data" button in `FileHeaderCard` navigates here), `DashboardTabs` (state in `?tab` via `useSearchParams`; only Intervals is a stub), `FileHeaderCard`, `MetricTilesRow`, `EmptyState`. Computed metric tiles (Avg/NP/Max Power, Est. FTP, IF, TSS) carry a `?` HelpTip in the corner with a one-line "how it's computed" — texts live in `metric-help.ts`, shared by Overview and Power; self-evident tiles (Moving Time, Distance) have none — the Moving Time tile shows `totalTimerTime` (falls back to elapsed) with the full elapsed time (`totalElapsedTime`) small in its top-right corner (`corner` prop of `MetricTile`); the Speed tile shows the average (`totalDistance / totalTimerTime`, km/h) with the max record speed (`enhancedSpeed ?? speed`, after cleaning) in the corner; the Avg Heart Rate tile is the mean of record `heartRate`. Overview has eight tiles in two rows of four (Moving Time, Distance, Speed, Avg HR / Avg Power, NP, Est. FTP, TSS). Keep the texts in sync with docs/Help/README when formulas change (+ example buttons from `example-files.ts`: the demo ride is served from `public/examples/`, the Garmin sample is fetched from their GitHub at click time; both open via `processUrl` and are **not** saved to History) |
| `components/charts/` | Recharts cards: Power, HeartRate, Cadence, Elevation, Speed + `PowerZonesPanel`, and `CombinedChart` — the shared expanded view: those five cards expand into one chart with all series (only the opener's series visible at first; legend items toggle the rest, each series on its own hidden Y axis, only the opener's axis shown) plus drag-to-select zoom (`useDragZoom` + ReferenceArea, "Reset zoom" button; on mobile a recharts Brush bar below the chart drives the zoom instead, hidden Y axes get width 0 and the modal paddings shrink). The Power card's zones panel stays card-only — the expanded view is the combined chart |
| `components/bottom/` | `PowerCurveCard`, `DataQualityCard`, `TrainingLoadCard` (kept but not rendered — see TODO; its Overview/Performance slots now show the Speed chart) |
| `components/history/` | `HistoryPage` — two render variants from `RideRow` columns, no FIT parsing: `HistoryTable` (desktop) and, on mobile (≤640px), `HistoryCardList` of `HistoryRideCard`s — non-interactive `RouteThumb` SVG polyline (from the stored `track`, empty placeholder for rides saved before the field existed), one-line file name middle-truncated with `shortenString` from `just-shorten` (12 chars each side, extension stays visible; CSS ellipsis as fallback), date · time, distance / avg speed / avg power |
| `components/help/` | `HelpPage` + sections `TrackCleaningHelp` / `PowerModelHelp` / `MetricsHelp` — static reference with formulas; content is a digest of [track-cleaning.md](track-cleaning.md), [power-estimation.md](power-estimation.md), [ftp-estimation.md](ftp-estimation.md); update together with the docs when algorithms change |
| `components/power-settings/` | `PowerSettingsBar` (strip below `FileHeaderCard`: selected position/surface/tires/pressure/weights/bottles + a gear icon; the open panel = `PowerSettingsPanel` selects + `RideMassFields` per-ride weight inputs + `BottleListEditor`), `PowerSettingsPanel` (selects, reused on Settings), `BottleListEditor` (add/remove bottles with ml volumes; water weight goes into total mass, reused on Settings); changing a value → `updateSettings` from `use-fit-processing` |
| `components/settings/` | `SettingsPage` — power calculation defaults for new rides (`usePowerSettings` + the shared `PowerSettingsPanel`), rider/bike weight (`useMassSettings`, clearable, defaults 82/8) and the manual FTP field (`useManualFtp`, clearable) |
| `components/share/` | `ShareButton` (in `FileHeaderCard`, opens the modal; builds `ShareCardData` via `use-share-card-data`), `ShareModal` (preview `<img>` of the rendered PNG, a gear button toggling the settings panel: `ShareTitleField` (custom ride name, committed on blur/Enter → `onTitleChange` → `updateTitle`, persisted in the ride row — [history-storage.md](history-storage.md)) and `ShareTilePicker` — `ToggleSwitch` per available tile, all on by default, state lives in the modal — and a Save button that downloads `<file name>.png`; closes on backdrop / X / Escape), `ShareTilePicker`. See [Share image](#share-image) |
| `components/map/` | `RouteMapCard` — full-width route map below the cards: Leaflet + OSM tiles, polyline over accepted points; the cleaned route is drawn in the palette's `success` green; a "Show Original" switch in the card header (shown only when cleaning rejected points) overlays the raw track in red (`heartRate`) underneath it; in dark theme tiles are dimmed with a CSS filter. `MapPinchZoom` — pinch zoom on a trackpad (ctrl+wheel, `zoomSnap={0}`); regular two-finger scroll is not intercepted. The "Leaflet" prefix in the attribution is hidden, the OSM copyright is kept (a condition of their tile policy) |
| `components/**/ui/` | styled-only components: `ChartCard` (chart/map card shell; its header carries an expand icon button opening `ChartCardExpanded` — a near-fullscreen modal, closed by backdrop / X / Escape; by default it re-renders the same title/aside/children stretched to full height, and the optional `expanded` prop overrides the modal content — the five metric chart cards pass `CombinedChart` there), `ChartCardExpanded`, `ChartTooltip` (header: elapsed time left, cumulative distance right — from the hovered point's `d` field; per-series units via the `units` map), `ChartFillGradient` (the shared area-fill gradient used by HR/Speed/Power Curve cards and the combined chart), `MetricTile`, `QualityRing`, `HelpTip`, `ToggleSwitch`, `AppLogo` (inline-SVG wordmark; theme colors via `--logo-*` CSS variables switched on `data-theme`) |
| `hooks/` | all fetching and computation (see below) |
| `db/` | IndexedDB layer — [history-storage.md](history-storage.md) |
| `types/` | `Activity`, `ProcessingState`, chart, metric, and theme types |
| `fit/` | UI helpers: `power-defaults.ts` (power model parameters for the web), `format-metrics.ts`, `downsample-points.ts` (cap of 2000 points per chart) |
| `charts/` | chart palette and tick formatter |
| `styles/`, `theme/` | `theme.css` and `ThemeContext` |
| `i18n/` | en/ru dictionaries, `LanguageContext`, `Translation` type — [i18n.md](i18n.md); all UI strings come from `useT()` |

CSS — plain files next to the component (`Component.tsx` + `Component.css`), no CSS-in-JS.

### Breakpoints

- **`max-width: 640px` — mobile.** The canonical mobile breakpoint; use it for any phone-layout change (e.g. `MetricTilesRow` tile grid, the Power chart card collapsing to one column: chart first, zones panel below it; `AppHeader` hidden entirely in favor of the bottom `MobileNavBar` + `MobileNavDrawer`, with `.app-shell` padded 56px at the bottom for the fixed bar; `SidebarInfoCards` reordered below the main content via grid areas).
- `max-width: 900px` — the sidebar column collapses (`App.css`, `SidebarPanel.css`).
- `max-width: 1280px` — intermediate grid step inside the dashboard: the single chart-card grid (`.dashboard-card-grid` in `DashboardPanel.css` — one container for all six cards so rows reflow without holes: 3 columns above, 2 from here down to mobile, 1 at mobile).

New responsive rules must reuse these values — don't introduce new breakpoints without updating this list.

## Hooks

Components are pure render; computation lives in hooks:

| Hook | What it does |
| --- | --- |
| `use-language-state` | loads/saves the UI language (IndexedDB `language` key), gates the first render, syncs `<html lang>` |
| `use-translation` | `useT()` → `{ t, lang, setLanguage }` from `LanguageContext` |
| `use-is-mobile` | `true` below the mobile breakpoint (`MOBILE_MEDIA_QUERY` from `styles/mobile-breakpoint.ts`, matchMedia + `useSyncExternalStore`); used by `HistoryPage` (mount one of table/cards; CSS media toggles stay) and `CombinedChart` (Brush vs drag-zoom, axis sizing) |
| `use-fit-processing` | file or `?record=id` → `Activity`, saving to history; `processUrl` — fetch + decode a file by URL without saving (example rides); `updateTitle` — set the custom ride name (state + row); `updateSettings` — recompute power/metrics on settings change and autosave ([history-storage.md](history-storage.md)) |
| `use-activity-summary` | meta (sport, date, device) and metrics for the tiles (durations, distance, avg/NP power, avg/max speed, avg heart rate) |
| `use-power-series`, `use-record-series` | power / HR / cadence / elevation / speed (km/h) time series with downsampling |
| `use-combined-series` | one merged `{t, power?, heartRate?, cadence?, elevation?, speed?}` series for `CombinedChart` |
| `use-drag-zoom` | drag-to-select zoom state for a numeric X axis (selection → domain, reset) |
| `use-power-settings` | last calculation settings from the `settings` store: read on mount, write on change |
| `use-power-curve` | power curve (`lib/power/power-curve`) |
| `use-route-points` | accepted point coordinates in degrees for the map (with downsampling) |
| `use-ftp` | the FTP the app runs on: manual from Settings wins, otherwise the estimate from the curve; returns `{ watts, source }` ([ftp-estimation.md](ftp-estimation.md)) |
| `use-manual-ftp` | manual FTP from the `settings` store: read on mount, save/delete on change |
| `use-mass-settings` | rider/bike mass from the `settings` store (null → defaults 82/8); powers the Settings inputs and `DefaultMassAlert` |
| `use-power-zones`, `use-tss` | zones and TSS on top of FTP |
| `use-enhance-download` | encodes and downloads the enhanced file |
| `use-share-card-data` | `ShareCardData` for the share image (title = file name without `.fit`, sport · device, date, accepted route points, the tile list with labels/values from `t`); memoized on activity/translation/FTP/TSS so the render effect doesn't loop |
| `use-share-card-image` | runs `renderShareCard` off-screen for the selected tiles and theme, returns a PNG data URL (null while rendering) |
| `use-ride-history` | ride list for History + `remove(id)` (optimistic delete, [history-storage.md](history-storage.md)) |
| `use-theme-state`, `use-theme` | theme state and context access |

## Share image

The **Share** button in `FileHeaderCard` opens `ShareModal` with a 1080×1920 (9:16, Instagram story) PNG of the ride, drawn entirely on a canvas — no DOM-to-image library. Code lives in `src/share/` (pure functions, one per file):

- `render-share-card` — the orchestrator. Layout is computed bottom-up so the tiles sit at the bottom and the map takes everything above: footer (ReFit wordmark + site URL) at the bottom, then the tile grid (`shareTilesHeight` for the selected count), then the ink header pill 48px above it, and the map fills from the top down to the middle of the pill (the pill overlaps the map edge; a gradient fades the map into the background).
- Map: `fitMapView` picks a fractional zoom + world-pixel origin so the accepted route fits with 120px padding (Web Mercator via `projectLatLng`, max zoom 18); `drawMapTiles` draws `tile.openstreetmap.org` tiles from the next integer zoom scaled down (tiles load with `crossOrigin="anonymous"` — OSM sends `Access-Control-Allow-Origin: *`, so the canvas stays exportable; failed tiles are skipped); `drawRouteLine` strokes the route in the map accent `#7dff46` over a dark outline. The "© OpenStreetMap contributors" credit is drawn in the map's top-right corner (required by the OSM tile policy).
- `drawShareHeader` (title — the custom ride name when set, else the file name without `.fit`; date; sport · device) and `drawShareTiles` (3-column grid, 200px tiles, `SHARE_TILE_*` constants) take a `ShareBox` (x, y, width) and a `ShareCardPalette` — `SHARE_CARD_PALETTE[mode]` mirrors the [theme](theme.md) tokens, so the image follows the current light/dark theme.
- Tiles (`ShareTileKey`, order in `SHARE_TILE_KEYS`): moving time, distance, avg speed, max speed, avg heart rate, avg power, NP, FTP (manual or estimated), TSS. A tile without data is not offered in the picker; the picker state is per modal instance (not persisted).
- `downloadDataUrl` saves the PNG through a temporary `<a download>`.

## Stubs (laid out, not implemented)

- The Intervals tab in `DashboardTabs` (`aria-disabled`).
- `TrainingLoadCard` — a "needs several rides" placeholder.
