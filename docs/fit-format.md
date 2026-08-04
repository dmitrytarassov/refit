# The FIT format and how we work with it

## What FIT is

FIT (Flexible and Interoperable Data Transfer) is Garmin's binary format for fitness data. A file is laid out as follows:

- **Header**, 12–14 bytes: size, protocol version, data length, `.FIT` signature, header CRC.
- **Messages** of two kinds: *definition messages* (describe field structure: type, size, byte order) and *data messages* (the actual data, referencing a definition by local message type).
- **CRC-16** of the file in the last 2 bytes.

Encoding quirks: coordinates are stored in *semicircles* (`degrees = semicircles × 180 / 2³¹`), timestamps are seconds since 31.12.1989 UTC, and numbers can be little- or big-endian (set in the definition message).

Message types found in our files: `fileId`, `deviceInfo`, `software`, `record` (per-second points: speed, coordinates, heart rate, cadence, temperature, altitude, grade), `session` (workout summary), `activity`.

## Reading and writing

We use the official `@garmin/fitsdk` (JavaScript SDK, includes both `Decoder` and `Encoder`).

**Reading** — `lib/fit/read-fit.ts`. Checks the signature (`isFIT()`) and CRC (`checkIntegrity()`), then decodes. Key point: besides the grouped messages (`messages.recordMesgs` etc.), we use `mesgListener` to collect **all messages in their original order** (`OrderedMesg[]`) — this is the list that gets written back, so message order in the output file matches the input.

**Writing** — `lib/fit/write-fit.ts`. `Encoder` accepts messages in exactly the format that `Decoder` produces (camelCase fields, `Date` for time, semicircles for coordinates), builds the definition messages itself, and computes the CRC.

**Message numbers** — `lib/fit/mesg-nums.ts`: the `RECORD_MESG_NUM` and `SESSION_MESG_NUM` constants from `Profile.MesgNum`.

## File modification principles

- Records (`record`) are never deleted outright: for a rejected GPS point only `positionLat`/`positionLong` are erased, while heart rate, cadence, temperature and the rest stay. Viewers handle records without coordinates just fine.
- Fields written by the device (`distance`, `speed`, altitude) are not recomputed.
- New data (power) is added as standard FIT profile fields: `record.power`, `session.avgPower` / `maxPower` / `normalizedPower`.

## Known round-trip limitations

- **Unknown messages** (vendor-specific ones not described in the SDK profile) are dropped on rewrite — the decoder runs with `includeUnknownData: false`.
- **Developer fields** (custom fields from third-party sensors) are not carried over yet: the encoder needs `developerDataIdMesg`/`fieldDescriptionMesg` for them. Our Magene files don't have any; for the product this needs finishing.
- The decoder expands component fields (e.g. `enhancedSpeed`), so the output file may differ from the input in size even with identical data.
