# Workout planner (`/?view=planner`)

A page of the web app ([web-app.md](web-app.md)) where a structured workout — warm-up, intervals, ramps, free ride — is assembled from blocks and drawn as zone-colored steps over time, the way trainer apps show a planned session. The toolbar's ramp / free-ride buttons are icon-only (lucide `TrendingUp` / `TrendingDown` / `Waves`, the name is in `aria-label`). **Status: early.** The timeline starts empty; the toolbar appends blocks to it and a click on a block opens its editor; Save stores the workout in IndexedDB ([history-storage.md](history-storage.md#workouts)); Download writes a `.zwo` file for Zwift / MyWhoosh.

## Workout model

`src/types/workout-step.ts`, `src/types/repeat-block.ts`, `src/types/workout.ts`:

| Type           | Fields                                                                                                                                                                                                                                 |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WorkoutStep`  | `kind` (`steady` / `ramp` / `free`), `seconds`, `from`, `to` — targets as a fraction of FTP (0.73 = 73% FTP); `steady` holds `from`, `ramp` goes linearly from `from` to `to`, `free` ignores both; optional `note` — a free-text hint |
| `RepeatBlock`  | `kind: "repeat"`, `times`, `skipLast`, `steps[]` — a group of plain steps ridden `times` times in a row; with `skipLast` the last step of the final repetition is dropped (a rest that would run straight into the cool-down)          |
| `WorkoutBlock` | `WorkoutStep \| RepeatBlock` — what the timeline holds                                                                                                                                                                                 |
| `Workout`      | `name`, `blocks[]`                                                                                                                                                                                                                     |

Targets are stored relative to FTP, so changing FTP in the header rescales the whole workout without touching the steps. TSS works on the unrolled timeline — `expandBlocks` (`src/planner/expand-blocks.ts`) replaces every repeat with its steps `times` over, honouring `skipLast`; a repeat's ridden length is `repeatSeconds` (the same unrolled sum, or `DEFAULT_REPEAT_SECONDS` = 10 min while it has no steps — the placeholder counts toward workout time so the chart width stays consistent). Repeats do not nest.

## Blocks

Every toolbar button appends one block of `DEFAULT_STEP_SECONDS` = 5 min to the end of the timeline (`makeZoneStep` / `makeToolStep` in `src/planner/make-step.ts`, `addStep` in `use-workout-planner`):

| Button    | Step                                                                                                                 |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| Z1 … Z6   | `steady` at the zone's target — `ZONE_TARGETS` = 50 / 56 / 76 / 91 / 106 / 121% FTP (`src/planner/planner-zones.ts`) |
| Ramp up   | `ramp` from 25% to 75% FTP (`RAMP_RANGE`)                                                                            |
| Ramp down | `ramp` from 75% down to 25% FTP                                                                                      |
| Free ride | `free`                                                                                                               |

## Name, saving, the list

- **Name** — the pencil next to the title swaps it for an input (`PlannerNameField`): Enter / blur commit the trimmed text (a history step, `rename`), Escape discards. An empty name shows as "New workout".
- **Save** (toolbar, left of Download) — if the name is empty or still the placeholder ("New workout" in either case, `isDefaultName`), `SaveNameModal` asks for one first (Enter or Save submits, the name is applied as a history step); then it writes name, blocks, FTP, duration and TSS to the `workouts` store; a new workout gets `?workout=id` in the URL (replaced in place, nothing visible changes), an opened one is overwritten. The button is disabled while writing and then reads "Saved" with a check for two seconds. FTP is saved with the workout because the targets are fractions of it.
- **Open** — `/?view=planner&workout=id` shows "Loading…" while the row is fetched (`useSavedWorkout`), then resets the planner from it (history cleared); an id that is not in the store shows a "not in the saved list" line. `/?view=planner` without an id is a new, empty workout.
- **Back arrow** — leads to `/?view=workouts`, the list of saved workouts (date, name, duration, TSS, delete, a "New workout" button). The list has no nav entry; it is reached from the planner or by URL.

## Download (`.zwo`)

The Download button (disabled on an empty timeline) builds a Zwift workout file — the format MyWhoosh imports too — with `buildZwo` (`src/planner/export/`) and saves it as `<name>.zwo` (`useZwoDownload`, object URL + `downloadDataUrl`; an unnamed workout is saved as "New workout"). Nothing has to be saved first.

- Repeats are **unrolled** (`expandBlocks`, `skipLast` honoured) — one element per ridden step, as in MyWhoosh's own exports.
- `steady` → `<SteadyState Duration Power>`, ramp up → `<Warmup Duration PowerLow PowerHigh>`, ramp down → `<Cooldown …>`, `free` → `<FreeRide Duration>`. Power values are fractions of FTP, three decimals at most.
- A non-blank note becomes `<textevent timeoffset="0" message="…"/>` inside its element. Name and messages are XML-escaped.
- Header: `<author>ReFit</author>`, `<name>`, an empty description, `<sportType>bike</sportType>`, no tags. Cadence targets are not part of the model, so they are not written.

Tests: `packages/web/test/build-zwo.test.ts`.

## Editing a block

A click on a block selects it (`selected: StepRef` in `use-workout-planner` — a top-level index plus the step index inside a repeat; a ring around the block) and opens `PlannerStepEditor` under the chart:

- **Duration** — minutes + seconds inputs (`PlannerDurationField`); a zero total is ignored.
- **Power** — `PlannerPowerField`: two inputs bound to the same target, `% FTP` and watts (`round(fraction · FTP)`); committing either rewrites the fraction, so the other input follows (and the watts follow a later FTP change). A steady block has one such field, a ramp two (start / end), free ride none.
- **Note** — a text input bound to `note`. A note whose trimmed text is not empty is drawn on the timeline (see Captions below).

Number inputs commit on blur / Enter (the same pattern as the ride weight fields); the editor closes with its X. `updateStep(ref, patch)` merges the patch into that step (`updateStepAt`).

## Repeat blocks

The toolbar's Repeat button appends an empty repeat block. On the timeline it is drawn as a group (`WorkoutChartRepeat`) as wide as its whole ridden length — `(sum of its steps) · times − (last step if skipLast)`, 10 minutes while empty — with the steps drawn **once**, each at its share of the cycle: 1 min Z6 + 3 min Z2 gives bars of 25% and 75% of the group whatever `times` is. Across the bottom 10% of the plot sits a `×N` bar (`WorkoutRepeatBar`) with a pencil button. A step note inside a repeat is placed where its bar is drawn (`stepCaptions` scales the step's offset in the cycle to the group's width).

- **Selecting** — the `×N` button toggles the repeat's selection (`toggleRepeat`); a selected repeat gets the ring and a solid ink bar. Clicking one of its bars selects that step (`{ index, child }`) and opens the step editor for it.
- **Filling** — while the selection sits in a repeat (the repeat itself or one of its steps), every toolbar block goes **into** that repeat (`addStepTo`); otherwise to the end of the timeline. Existing top-level blocks are not moved into a repeat.
- **Settings** — the pencil opens `RepeatModal` (backdrop / X / Escape to close): a repetitions stepper (2..99, the shared `PlannerStepperField`) and a "Skip the last step of the final repeat" switch (`ToggleSwitch`). Changes apply at once (`updateRepeat` → `updateRepeatAt`).

## Keyboard, delete and history

`usePlannerKeys` listens on `window` while the page is mounted and maps keys through `plannerKeyAction` (`src/planner/planner-key-action.ts`); keys typed into an input / textarea / select are left to the control (its own native undo, Backspace in a field):

| Keys                            | Action                                                                                                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Delete / Backspace              | remove the selected block — a top-level step, a repeat with everything in it, or one step inside a repeat (`removeSelected` → `removeBlockAt`); the selection is cleared |
| Ctrl+Z / ⌘Z                     | undo                                                                                                                                                                     |
| Ctrl+Shift+Z / ⌘⇧Z, Ctrl+Y / ⌘Y | redo                                                                                                                                                                     |

The workout (name + blocks) lives in `useHistoryState` (`src/hooks/use-history-state.ts`): a `useReducer` over `{ past, present, future }` (`historyReducer`, `src/planner/history-reducer.ts`). Every change — adding, editing, deleting a block, repeat settings, each keystroke in a note — is one step; `set` pushes the present onto the past and clears the future, an update that returns the same object is not recorded, the past is capped at 100 steps. Undo / redo drop the selection, since it addresses blocks by position. FTP and weight are rider settings, not part of the workout, and are not in the history.

## Pasting a workout

The **Paste** button (left of Download) opens `ImportModal`: a textarea and **Apply**. The text is parsed by `parseWorkoutText` (`src/planner/parse-workout-text.ts`, helpers in `src/planner/import/`) at the current FTP. If nothing is recognised the modal shows an error; if the plan is empty the parsed blocks replace it at once; otherwise the modal asks **Replace** or **Append** (`replaceBlocks` / `appendBlocks`, each one history step). State lives in `useWorkoutImport`.

The expected text is a trainer-app export, Russian UI, one value per line:

```
Каденс по умолчанию · 80–95 об/мин      ← ignored
Разминка                                 ← section name (ignored)
16:00                                    ← section duration (ignored)
ВРЕМЯ / МОЩНОСТЬ / КАДЕНС · ОБ/МИН       ← three header lines: this is what marks a section
5 мин                                    ← a step starts with its duration ("1 ч 5 мин", "30 сек")
140–151Вт                                ← power band → target = midpoint (146 W → 146 / FTP)
75–85                                    ← bare number range = cadence, dropped
ускорение сидя в седле                   ← any other line = the step's note
—                                        ← no power target → free ride
3×                                       ← multiplier
```

Rules (`splitSections` → `parseSection` → `sectionBlocks`):

- The text is split into sections at every ВРЕМЯ / МОЩНОСТЬ / КАДЕНС header; the two lines before a header (name, duration) are not steps.
- Inside a section, steps before an `N×` are plain blocks. The steps after it go into one `RepeatBlock` ×N — **except the section's last step, which stays plain** (the rest before the cool-down). A later `N×` closes the previous repeat. A repeat that would end up empty (multiplier followed by a single step) takes that step.
- Blank lines are ignored; `x`, `х` and `×` all work as the multiplier sign; the dash in a band may be `–` or `-`.

Tests with the real exports: `packages/web/test/parse-workout-text.test.ts` (`bun test`).

The three modals of the page (repeat settings, paste, name) share `components/planner/ui/PlannerModal` — backdrop, header with X, Escape, footer and button styles.

## Header numbers

- **Workout time** = sum of `seconds` over the steps (`workoutSeconds`).
- **Training load** = planned TSS (`workoutTss`), the same formula as for a ride ([ftp-estimation.md](ftp-estimation.md)): `TSS = sec · IF² / 36` per step, where IF is the target as a fraction of FTP. A ramp integrates IF² along its slope: the mean of IF² between `a` and `b` is `(a² + ab + b²) / 3`. Free ride adds nothing. Weight is shown but not used yet.

## Chart

Pure CSS/HTML (no recharts), `src/components/planner/WorkoutChart.tsx`:

- **X axis** — `axisSeconds` = the workout plus ten minutes, rounded up to a whole ten, at least an hour; ticks every 10 min up to 1 h, 20 min up to 2 h, 30 min beyond. The steps row is a flex container of width `total / axis`, each step a flex item with `flex-grow: seconds`, so the layout is responsive without measuring.
- **Y axis** — height is `target / yMax`, `yMax = max(1.35, peak + 0.1)`. Dotted lines mark the lower bound of each zone Z2..Z6 — the same `ZONE_TARGETS` values 56 / 76 / 91 / 106 / 121% FTP (these are the trainer-app zone edges, one point above the Coggan upper bounds the ride dashboard uses — [ftp-estimation.md](ftp-estimation.md)); Z1 is labelled at the baseline. A step is colored by the zone its target falls in (`zoneIndex`).
- **Zone colors** — the palette has no rainbow ([theme.md](theme.md)), so zones are a ladder of ink: Z1 `--border-strong` (neutral gray), Z2..Z5 `color-mix` of `--ink` with the card surface at 38 / 52 / 66 / 82%, Z6 `--ink` itself. Defined as `--zone-1..6` on `.planner-page`, so they follow the dark theme.
- **Blocks** — each step is a `<button>` (`aria-pressed` when selected) holding the colored fill. **Ramps** — a `linear-gradient` between the start and end zone colors, cut to a wedge with `clip-path: polygon(...)`. **Free ride** — a dashed gray block at 50% height.
- **Captions** — every step with a non-blank `note` gets a speech-bubble marker at its start time in the band above the bars, with a dotted vertical line down to the baseline (`stepCaptions` → `WorkoutChartCaption`); the text is in the marker's `title`. Markers closer than 4% of the axis to the previous one drop one row (`captionLevels`, four rows cycling) so they don't overlap.

## Not yet

Reordering blocks, moving existing blocks into a repeat, undo / redo buttons for touch devices, cadence targets (dropped on paste), an unsaved-changes indicator, saving workouts, export to `.zwo` / `.fit`, W/kg from weight.
