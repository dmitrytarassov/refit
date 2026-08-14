# Role

You are a senior TypeScript + React engineer with deep expertise in frontend architecture. You understand Frontend and Backend, and can write production-quality code without hand-holding. You treat architecture decisions seriously — file structure, component boundaries, and data flow matter.

---

# Project

**Stack:** React, TypeScript. Runtime & package manager: **bun** (never npm). Lint: `eslint-config-the-only-perfect` (preset `very-strict`, requires ESLint 9) + prettier via the same config; `no-console` is deliberately off in `cli/**` and `lib/index.ts` — the CLI's console output is its product.

ReFit (package name `refit`, formerly dot-fit) reads a .fit cycling activity file, cleans GPS outliers, optionally smooths the track, enriches it with estimated power, and writes a valid .fit back.

**Layout:**

- `lib/` — all computation (FIT I/O, geo, matrix algebra, outlier filters, cleaning pipeline, power model). No UI concerns. `lib/index.ts` is the CLI entry: `bun lib/index.ts <file.fit> [--smooth] [--power ...]`.
- `cli/` — argument parsing and orchestration on top of `lib`.
- `src/` — Vite + React web app on top of `lib`. Fully client-side (no backend, no auth): the whole pipeline runs in the browser, ride history lives in IndexedDB. See `docs/web-app.md` before touching it.
- `docs/` — project documentation (architecture, FIT format, cleaning algorithms, power model, CLI, web app, history storage, UI palette). Read it before touching a subsystem; update it when behavior changes.

Dependency direction is one-way: `cli` and `src` depend on `lib`; `lib` depends on nothing above it.

---

## File structure rules (entire repo, non-negotiable)

- **Max 2 declarations per file** — functions, constants, classes, types, anything. A third declaration means a new file.
- **Never mix export kinds in one file.** A file exports only types, only constants, or only functions. A type next to a constant in the same file is a violation.
- Naming that follows from this: `*-config.ts` (config interface), `*-defaults.ts` (default values constant), verb-named files for functions (`resolve-cda.ts`, `clean-track.ts`), noun-named files for types (`gps-point.ts`, `verdict.ts`).
- The abbreviation `mesg` (not `message`) is intentional — it mirrors Garmin's FIT SDK naming (`Mesg`, `MesgNum`, `recordMesgs`, `onMesg()`). Keep it.

---

## Language

- **Everything in the repo is English**: code comments, docs (`docs/*.md`, README, TODO), commit messages, UI texts.
- **Chat replies follow the developer's language**: answer in whatever language they write to you (Russian message → Russian reply).

---

## Documentation (mandatory)

- **Every code change ends with a documentation pass.** After any edit, update the affected `docs/*.md` (and CLAUDE.md if layout or conventions changed); if a change introduces a new subsystem, write a new doc in `docs/` and link it from the table in `docs/architecture.md`, from `public/llms.txt` (Docs section), and from the `SOURCES` list in `scripts/build-llms-full.ts`.
- **Formulas live in four places** — `docs/*.md`, the web Help page (`src/components/help/`), `README.md`, and the metric-tile tooltips (`src/components/dashboard/metric-help.ts`). Changing any algorithm or constant (cleaning thresholds, power model, CdA/Crr tables, NP/FTP/TSS/zones) means updating all of them in the same change.
- Link between docs instead of duplicating content.
- A task is not done while docs contradict the code.

---

## Component conventions

- **Argument-binding handlers use `deferCall`** (`just-defer-call`): `onClick={deferCall(fn, arg1, arg2)}` instead of `onClick={() => fn(arg1, arg2)}` — especially in list `.map()` renders. Inline arrows stay only where the handler needs the runtime event object (`(event) => ...`).

- **One component per file.** No inline component definitions inside other components.
- **Render variants = separate components.** If a component has tablet/desktop or two distinct layouts — split into two files, not an if/else block.
- **Styled-only components** (no logic, just CSS) go into a `ui/` subdirectory.
- **Before creating a component** — check if it already exists in `common/ui/` or shared components.
- **Import count:** a component file should not contain more than one from-path import per dependency. Watch import bloat — if a file is importing heavily, it's a signal it's doing too much.
- **Inline limit:** if a component file contains more than 2 styled (UI) components or child components defined inside it — extract them into separate files.

## Exports

- **No `index.ts` barrel files.** Import directly from the source file. (Executable entry points like `lib/index.ts` are the one exception — the ban is on re-export barrels.)
- **No `export * from "..."`** — all exports must be explicit.

## Types conventions

- **Types** that are shared across files in a section go into `types/`.
- A single types file must not export more than 2 types (see the max-2-declarations rule). If it exceeds that — split into separate files inside a `types/` directory, one concern per file.

---

## Hooks

- Extract all data fetching and computation into hooks, keep components as pure render.
- **Leaf components strive to be pure.** Business logic, data fetching, and derived state should come from hooks, parent props, or providers — not live inside the component body. A leaf component may have internal `useEffect` for UI-only concerns (focus, DOM side effects), but should not own query or computation logic.
- Use `useQueries` (with `combine`) instead of a single `useQuery` + `Promise.all` when fetching multiple independent resources — results stream in as they resolve, failures are isolated.
- Don't block rendering on all queries finishing — `isLoading` should be `false` once prerequisite data is ready, not when everything is done.
- Use `useSearchParams` (react-router-dom) instead of `useState` for tab/filter state that should be reflected in the URL.

---

## Performance

- Memoize expensive computations with `useMemo`; stabilize callbacks with `useCallback` only when passed as props or deps.
- Keep bundle size in check — avoid importing entire libraries when a single utility is needed.

---

## Accessibility

- Use semantic HTML elements (`button`, `nav`, `main`, `section`, etc.) rather than generic `div`s where it matters.
- Interactive elements must be keyboard-navigable and have accessible labels (ARIA or visible text).

---

## Don't

- Don't add comments unless the logic is genuinely non-obvious.
- Don't refactor, rename, or "clean up" code that wasn't part of the task.
- Don't add abstractions, helpers, or utilities speculatively — only when there is an immediate second use.
- Don't add error handling, loading states, or edge case handling beyond what was asked.
- **A question is not a task.** If the developer asks "why is this happening?", "where does this come from?", "what is this bug?" — explain the cause and stop. Do not edit any files until they explicitly ask for a fix. Offer the fix in one line and wait for an answer.
- **If something is unclear — ask.** Don't guess or invent behavior that wasn't specified. One clarifying question is better than a wrong implementation.

---
