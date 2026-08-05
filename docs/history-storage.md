# Ride history (IndexedDB)

There is no auth — everything is stored locally in the browser, in IndexedDB (`src/db/`). Database `refit` (renamed from `dot-fit` on 2026-08-04; the old database's data was not migrated — history saved before the rename remains in the orphaned `dot-fit` database), version 2, two stores:

- `rides` — rides (autoIncrement `id`, index on `fileName`);
- `settings` — key-value: the `power` key holds the last selected calculation settings (`RideSettings`: `cda` position + `crr` surface/tires/pressure) — the next loaded ride is initialized with them; the `ftp` key holds the manual FTP in watts (absent when not set — deleting the value removes the key, [ftp-estimation.md](ftp-estimation.md)); the `mass` key holds `MassConfig { riderKg, bikeKg }` (absent → defaults 82/8 are used and the dashboard shows a reminder).

## Row (`RideRow`)

Metrics live in separate columns so History doesn't parse FIT on every render: `fileName`, `createdAt` (ms, first track record), `durationSec`, `distanceM`, `avgPower`, `normalizedPower`, `ftpWatts` (estimate, [ftp-estimation.md](ftp-estimation.md)), `tss`, `settings` (this ride's calculation settings), plus the file itself (`file: ArrayBuffer`).

## Flow

- **New ride**: after parsing and enrichment (`useFitProcessing`) — if no file with that `fileName` exists yet, `buildRideRow` computes the columns and `saveRide` writes the row; the URL gets `?record=id` (`setSearchParams` with `replace`, no reload).
- **`/?record=id`**: `useFitProcessing` reacts to the parameter (`useSearchParams`) — the file is taken from the database (`getRide`) and run through the same pipeline whether it's a first page load or a client-side navigation; the dashboard doesn't care where the buffer came from.
- **`/?view=history`**: the History page (`HistoryPage` + `useRideHistory` → `listRides`, the file is not loaded into the list) — a table with columns from the database, clicking a file is a client-side navigation (`<Link>`) to `/?record=id`.
- **Deleting a ride** — two entry points: the trash button in the History table (two-step inline confirm — first click arms the button, second deletes; optimistic list update) and the dashboard eraser's "Delete" option for the currently open ride. Both go through `deleteRide` erasing the row from the `rides` store. No undo — the file is gone from the database. A stale `/?record=id` link to a deleted ride shows the existing "Ride #N not found in history" error.
- **Changing calculation settings** (`PowerSettingsBar` → `updateSettings` in `useFitProcessing`): power and metrics are recomputed in place (no re-decode), the ride row is overwritten (`updateRide`) with the new metrics and settings — History immediately shows current numbers; the same settings are written to the `settings` store as the latest.

## Limitations

- Deduplication is by file name only: the same ride under a different name gets saved twice.
- The upgrade in `open-rides-db.ts` only creates missing stores (v1 → v2 added `settings`); new optional `RideRow` fields need no migration, but on an incompatible row change, bump the version and write a proper upgrade.
