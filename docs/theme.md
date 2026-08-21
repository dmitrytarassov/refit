# Ink and brass — palette specification

## Concept

The app does one thing: takes a file with holes and returns a fixed one. The palette is built around that, not around a mood.

Two colors carry meaning:

- **Ink (indigo `#2A3572`)** — the interface. Buttons, links, active states, focus. Everything clickable.
- **Brass (`#C0891F`)** — data the app has changed. The corrected line on a chart, a detected gap, the processing result.

The rule everything else follows from:

> Brass appears only where the app did something to the user's data. Indigo — only where the user can do something themselves.

If brass ends up on a button, the rule is broken. If indigo draws the original chart line — same thing.

Everything else is neutral cool gray with a slight blue admixture, so it doesn't argue with the indigo.

---

## Light theme

### Surfaces and borders

| Token | Hex | Purpose |
| --- | --- | --- |
| `--surface-page` | `#F5F6F9` | Page background |
| `--surface-card` | `#FFFFFF` | Cards, panels, modals |
| `--surface-subtle` | `#EDEFF5` | Table row hover, zebra stripes, inactive tab |
| `--border` | `#DFE3EB` | Primary border, dividers |
| `--border-strong` | `#C7CDDA` | Border hover, input borders |

### Text

| Token | Hex | Purpose |
| --- | --- | --- |
| `--text-primary` | `#161B33` | Headings, metric values, body text |
| `--text-secondary` | `#646B7D` | Captions, labels, supporting text |
| `--text-muted` | `#8C93A5` | Placeholders, units, metadata |

`--text-primary` is not pure black — it's indigo diluted to near-black. That's what glues the palette together: text and primary belong to the same family.

### Ink (interactive)

| Token | Hex | Purpose |
| --- | --- | --- |
| `--ink` | `#2A3572` | Primary button fill, links, active tab |
| `--ink-hover` | `#1E2757` | Hover |
| `--ink-active` | `#161D45` | Active / pressed |
| `--ink-tint` | `#EAECF5` | Selected row background, badge, selected state |
| `--ink-on` | `#FFFFFF` | Text on the fill |

### Brass (changed data)

| Token | Hex | Purpose |
| --- | --- | --- |
| `--brass` | `#C0891F` | Enhanced line on charts, edit markers, attention indicator |
| `--brass-strong` | `#A57316` | Hover on elements where brass is interactive (rare) |
| `--brass-text` | `#8A6314` | Brass as text — this shade only |
| `--brass-tint` | `#FAF1DE` | "gaps found" badge background, highlight of a changed segment |

`#C0891F` gives a 3.07:1 contrast on white. That's enough for lines and icons (3:1 minimum for graphical elements) but **not enough for text**. For text, always `--brass-text`.

### Statuses

| Token | Hex | Contrast |
| --- | --- | --- |
| `--success` | `#157F52` | fills / icons |
| `--success-text` | `#0E5A3A` | 7.16:1 on `--success-tint` |
| `--success-tint` | `#E4F2EB` | — |
| `--danger` | `#B32D38` | 6.27:1 on white |
| `--danger-text` | `#7E1D25` | 8.71:1 on `--danger-tint` |
| `--danger-tint` | `#FBEBEC` | — |

**There is no separate `warning` in the palette — deliberately.** In this product, "attention" and "we fixed this" are the same event. Brass plays the warning role. Introducing a third yellow-orange color next to brass would break both.

---

## Charts

The main case is comparing two states of the same series.

| Role | Hex | Style |
| --- | --- | --- |
| Original | `#A8AFC2` | 1.5px, `dasharray 4 3` |
| Enhanced | `#C0891F` | 2px, solid |
| Grid | `#E7EAF1` | 1px |
| Axis labels | `#646B7D` | 12px |
| Highlight band | `#FAF1DE` | fill of the segment where edits were made |

The dashed stroke on the original is mandatory. Distinguishing by color alone doesn't work: gray and brass blur together on a small chart, and it also excludes users with color vision deficiencies.

For multi-series charts (power, heart rate, cadence, elevation at once):

| Series | Hex |
| --- | --- |
| Power | `#2A3572` |
| Heart rate | `#B32D38` |
| Cadence | `#4A7BA8` |
| Elevation | `#C7CDDA` (area fill, 40% opacity) |
| Temperature | `#8A6314` |

Brass `#C0891F` is **not used** in multi-series charts — it's reserved for the "fixed" state and must stay unambiguous.

### Route line

The cleaned route on the map and on the share image is a start → finish gradient: 100 pieces interpolated in RGB between the two colors of the selected palette, no outline. Five palettes live in `src/route/route-palettes.ts` (`ROUTE_PALETTES`, picked in the map card header, saved in settings):

| Key | Start | End |
| --- | --- | --- |
| `classic` (default) | `#0048ff` | `#418bd4` |
| `sunset` | `#ff3d00` | `#ffc400` |
| `forest` | `#00897b` | `#aeea00` |
| `violet` | `#6a00f4` | `#ff2e88` |
| `graphite` | `#1c1c1e` | `#9a9aa3` |

The raw-track overlay ("Show Original") stays a single `heartRate` red line.

---

## Dark theme

Not an inversion. Indigo becomes unreadable on a dark background, so primary is lightened and the button fill gets its own shade.

| Token | Hex | Note |
| --- | --- | --- |
| `--surface-page` | `#0F1220` | |
| `--surface-card` | `#171B2E` | |
| `--surface-subtle` | `#1E2338` | |
| `--border` | `#2A3049` | |
| `--border-strong` | `#3A4160` | |
| `--text-primary` | `#E8EAF2` | 14.18:1 on card |
| `--text-secondary` | `#9AA1B8` | 6.62:1 |
| `--text-muted` | `#6E7590` | 3.74:1 — non-text captions only |
| `--ink` | `#3D4A9E` | button fill, white text gives 7.86:1 |
| `--ink-hover` | `#4A59B8` | |
| `--ink-fg` | `#8B99E8` | links and indigo text, 6.34:1 |
| `--ink-tint` | `#232948` | |
| `--brass` | `#D9A33C` | 7.51:1 — on dark, brass reads as text too |
| `--brass-tint` | `#332714` | |
| Original (chart) | `#565E78` | |

---

## Contrast ratios

| Pair | Ratio | WCAG |
| --- | --- | --- |
| `text-primary` / `surface-card` | 16.95:1 | AAA |
| `text-primary` / `surface-page` | 15.69:1 | AAA |
| `text-secondary` / `surface-card` | 5.33:1 | AA |
| `text-secondary` / `surface-page` | 4.93:1 | AA |
| `text-muted` / `surface-card` | 3.07:1 | large text only |
| `ink` / `surface-card` | 11.35:1 | AAA |
| `ink-on` / `ink` | 11.35:1 | AAA |
| `ink` / `ink-tint` | 9.63:1 | AAA |
| `brass` / `surface-card` | 3.07:1 | graphics, not text |
| `brass-text` / `surface-card` | 5.42:1 | AA |
| `brass-text` / `brass-tint` | 5.91:1 | AA |
| `danger` / `surface-card` | 6.27:1 | AA |

---

## What not to do

- Don't paint the CTA brass. The "Enhance file" button is indigo. Brass appears after the click, in the result.
- Don't use `--brass` as a text color. Only `--brass-text`.
- Don't add a third accent. If you think you need a new color, you most likely need a new gray level or a tint from an existing pair.
- Don't distinguish chart series by color alone. Dashes, weight, markers.
- Don't gradient between indigo and brass. They're complementary in temperature; the midpoint passes through muddy olive.
- Don't use pure black `#000` or pure gray `#808080` — they fall out of the cool scale.
