# Week 07 — Lab report

**Name:** Ayan Zeinetula (24B031804)
**Group:** SITE, IS, 3rd year
**Date:** 8 November 2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Project I continue (`week-06` = my Week 06 Bolt project, `starter` = the provided starter) | week-06 (the Bolt export in `week-06/original/project`; `week-06/prototype/` was empty) |
| Bolt project link (or `not shared`, and why) | not shared: I continued from the exported project files in the repository, not from the Bolt workspace |
| Assistant that generated the tests (tool) | Claude (claude.ai, agent session) |
| Exact model (with its version, or `not displayed`) | Claude Opus 5.5 (claude-opus-5-5) |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | Claude's cloud Linux workspace (Node 22.23.4), not my own laptop |
| Vitest version (the `RUN  v…` line of a run) | |
| Test command | `npx vitest run` (same as `npm test`), run inside `week-07/app/` |

---

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") | `checkAvailability()` in `src/lib/availability.ts` |
| Its inputs | `{ room, start, end, now }`: the whole `Room` object (its `blocked` flag and `bookings` array) plus three numbers in minutes after midnight |
| What it returned | a `Decision` object: `{ status: 'available', message }` or `{ status: 'unavailable', message, reason }`, not a boolean |
| How the page used it | `App.tsx` called it inside a `useMemo` with the selected room and the parsed HH:MM inputs, and `DecisionCard` showed Available / Unavailable from `status` plus the message |

**What I changed to extract `canBook`.** Say which file it now lives in, what you moved, and why
the behaviour did not change. Also say which file of the page now calls it. 40 words or more.

<!-- Write below this line -->
`canBook({ start, end, now, blocked, bookings })` now lives in `app/src/booking.ts` and returns only `true` or `false`. I moved the five conditions of `checkAvailability()` into it in the same order and with the same operators, including `start > 0`, which I suspect (AC1 says `0 ≤ start`). The two constants moved with them. `checkAvailability()` became `describeDecision(available, input)` in `src/lib/availability.ts`: it no longer decides, it only picks the Week 06 message for a decision it is given. The page file `src/App.tsx` imports `canBook` from `./booking`, calls it with the selected room's `blocked` flag and `bookings`, and passes the result to `describeDecision`. To check that behaviour did not change, I ran the old `checkAvailability()` and the new `canBook()` side by side over 163,494 generated inputs (three booking sets, blocked on/off, three values of `now`, every start/end pair in 5-minute steps from −10 to 1450) and found 0 differences. `npx tsc` and `npm run build` both pass.

---

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | 660 is the end of the 600–660 booking and the start of the request; the intervals only touch, which AC4 explicitly allows, and nothing else (time, length, block) is broken |
| T02 | 540–570 (starts now) | false | AC1 | start 540 equals now 540; AC1 needs start strictly after the current time, and "equal" is not after |
| T03 | 720–720 (zero duration) | false | AC1 | start 720 = end 720, so `start < end` in AC1 is false; a zero-length interval is not a booking |
| T04 | 750–720 (reversed) | false | AC1 | start 750 is after end 720, so `start < end` fails; a reversed interval is invalid under AC1 even though it is in the future |
| T05 | 1380–1441 (past day end) | false | AC1 | end 1441 is one minute past midnight of the next day, so `end ≤ 1440` in AC1 fails; the 61-minute length and the time are otherwise fine |
| T06 | 720–840 (120 minutes) | true | AC2 | 840 − 720 = 120 minutes; AC2 only rejects longer than 120, so exactly 120 must be accepted, and it does not touch 600–660 |
| T07 | 720–841 (121 minutes) | false | AC2 | 841 − 720 = 121 minutes, one minute longer than AC2 allows; everything else about the request is valid |
| T08 | 570–600 (touching before) | true | AC4 | 600 is both the end of the request and the start of the booking; touching endpoints are allowed by AC4, and 570 > now 540 |
| T09 | 630–690 (partial overlap) | false | AC4 | 630–690 shares 630–660 with the booking, a 30-minute overlap, so AC4 rejects it |
| T10 | 570–690 (contains booking) | false | AC4 | 570–690 covers the whole 600–660 booking; the overlap is the full booking, so AC4 rejects it (length is exactly 120, so AC2 is not the reason) |
| T11 | 615–645 (inside booking) | false | AC4 | 615–645 lies completely inside 600–660; every minute overlaps, so AC4 rejects it |
| T12 | 600–660 (identical interval) | false | AC4 | same start and end as the existing booking: the strongest overlap there is, so AC4 rejects it |
| T13 | 660–720, blocked = true | false | AC3 | 660–720 would be Available (as T01), so the only reason to reject is the block; AC3 says a blocked room is always rejected |
| T14 | 630–690, bookings = [] | true | AC4 | 630–690 overlapped in T09, but with no bookings there is nothing to overlap; it is in the future, 60 minutes, unblocked, so AC1–AC4 all accept it |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | a check is a read; AC5 says the decision must not change the existing booking data, so the bookings array must equal a copy taken before the call, and the call must be an Available one so the success path is exercised |
| X1 | 1320–1440 (ends exactly at 24:00, 120 minutes) | true | AC1, AC2 | the other end of the day: AC1 allows `end ≤ 1440`, so 1440 itself is inside the day, and 120 minutes is not longer than AC2's limit; nothing overlaps, so both boundaries hold at once |
| X2 | 750–800, bookings = [{600–660}, {720–780}] | false | AC4 | two bookings at once: the request is clear of the first booking but overlaps 750–780 of the second; AC4 says "any" existing booking, so a rule that only looks at the first booking must fail this case |

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

---

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

````text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.

Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.

Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests ourselves.

AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.

Default fixture: now = 540, blocked = false, bookings = [{ start: 600, end: 660 }], fresh for every test.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | 660 is the end of the 600–660 booking and the start of the request; the intervals only touch, which AC4 explicitly allows, and nothing else (time, length, block) is broken |
| T02 | 540–570 (starts now) | false | AC1 | start 540 equals now 540; AC1 needs start strictly after the current time, and "equal" is not after |
| T03 | 720–720 (zero duration) | false | AC1 | start 720 = end 720, so `start < end` in AC1 is false; a zero-length interval is not a booking |
| T04 | 750–720 (reversed) | false | AC1 | start 750 is after end 720, so `start < end` fails; a reversed interval is invalid under AC1 even though it is in the future |
| T05 | 1380–1441 (past day end) | false | AC1 | end 1441 is one minute past midnight of the next day, so `end ≤ 1440` in AC1 fails; the 61-minute length and the time are otherwise fine |
| T06 | 720–840 (120 minutes) | true | AC2 | 840 − 720 = 120 minutes; AC2 only rejects longer than 120, so exactly 120 must be accepted, and it does not touch 600–660 |
| T07 | 720–841 (121 minutes) | false | AC2 | 841 − 720 = 121 minutes, one minute longer than AC2 allows; everything else about the request is valid |
| T08 | 570–600 (touching before) | true | AC4 | 600 is both the end of the request and the start of the booking; touching endpoints are allowed by AC4, and 570 > now 540 |
| T09 | 630–690 (partial overlap) | false | AC4 | 630–690 shares 630–660 with the booking, a 30-minute overlap, so AC4 rejects it |
| T10 | 570–690 (contains booking) | false | AC4 | 570–690 covers the whole 600–660 booking; the overlap is the full booking, so AC4 rejects it (length is exactly 120, so AC2 is not the reason) |
| T11 | 615–645 (inside booking) | false | AC4 | 615–645 lies completely inside 600–660; every minute overlaps, so AC4 rejects it |
| T12 | 600–660 (identical interval) | false | AC4 | same start and end as the existing booking: the strongest overlap there is, so AC4 rejects it |
| T13 | 660–720, blocked = true | false | AC3 | 660–720 would be Available (as T01), so the only reason to reject is the block; AC3 says a blocked room is always rejected |
| T14 | 630–690, bookings = [] | true | AC4 | 630–690 overlapped in T09, but with no bookings there is nothing to overlap; it is in the future, 60 minutes, unblocked, so AC1–AC4 all accept it |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | a check is a read; AC5 says the decision must not change the existing booking data, so the bookings array must equal a copy taken before the call, and the call must be an Available one so the success path is exercised |
| X1 | 1320–1440 (ends exactly at 24:00, 120 minutes) | true | AC1, AC2 | the other end of the day: AC1 allows `end ≤ 1440`, so 1440 itself is inside the day, and 120 minutes is not longer than AC2's limit; nothing overlaps, so both boundaries hold at once |
| X2 | 750–800, bookings = [{600–660}, {720–780}] | false | AC4 | two bookings at once: the request is clear of the first booking but overlaps 750–780 of the second; AC4 says "any" existing booking, so a rule that only looks at the first booking must fail this case |

The function is in src/booking.ts and the page imports it with `import { canBook } from './booking'`. The test file will sit beside it as src/booking.test.ts.

src/booking.ts:
```ts
// The booking decision, extracted from checkAvailability() in src/lib/availability.ts
// (Practice #07, Task 1). The conditions are copied as they were, in the same order.
// start, end, now: minutes after midnight on the same day (600 = 10:00, 1440 = 24:00).

export interface Interval {
  start: number;
  end: number;
}

export interface BookingRequest {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Interval[];
}

export const MINUTES_PER_DAY = 1440;
export const MAX_BOOKING_MINUTES = 120;

export function canBook({ start, end, now, blocked, bookings }: BookingRequest): boolean {
  // AC1: a valid interval inside the day
  if (!(start > 0 && end > start && end <= MINUTES_PER_DAY)) return false;
  // AC1: start must be after the supplied current time
  if (start <= now) return false;
  // AC2: no longer than 120 minutes
  if (end - start > MAX_BOOKING_MINUTES) return false;
  // AC3: blocked room
  if (blocked) return false;
  // AC4: overlap; touching endpoints are allowed
  if (bookings.some((b) => start < b.end && end > b.start)) return false;
  return true;
}
```
````

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

````text
[The test file from the answer is saved unedited as suites/first/booking.test.ts. Everything else from the answer follows.]

# Vitest tests for `canBook` (src/booking.ts)

## Test file: `src/booking.test.ts`

(see suites/first/booking.test.ts)

## Run command

Run from the project root. If Vitest is not installed yet, install it first:

```bash
npm install -D vitest
npx vitest run src/booking.test.ts
```

`vitest run` runs the tests once and exits; it does not start watch mode. Vitest runs TypeScript files without extra setup.

These tests have not been run. I traced each case through the current `canBook` code by hand, and I expect all 17 tests to pass. Your own run is the real result.

## AC mapping

| AC | Covered by | Notes |
| --- | --- | --- |
| AC1 | T02, T03, T04, T05, X1 | Covers start = now, zero length, reversed interval, end 1441, and end exactly 1440. The `0 ≤ start` lower bound is not tested (see flag 1). |
| AC2 | T06, T07, X1 | Exactly 120 is accepted, 121 is rejected. T10 is also 120 minutes but tests AC4. |
| AC3 | T13 | Same interval as T01 (true), so the block is the only reason for false. |
| AC4 | T01, T08, T09, T10, T11, T12, T14, X2 | Touching before and after, partial overlap, containing, inside, identical, no bookings, and a second booking. |
| AC5 (data part) | AC5 test; also every test through `expectDecision` | Every test checks that the bookings array is the same object with the same contents. The "show a clear decision" part is UI and is not covered (flag 2). |
| AC6 | Not covered | This is page layout and feedback behaviour, which a unit test of `canBook` cannot check (flag 2). |

## Unclear requirements and points to confirm

1. **AC1 lower bound and the code do not match.** AC1 says `0 ≤ start`, but the code checks `start > 0`, so `start = 0` is rejected. This can only matter if `now < 0`, because the code also needs `start > now`. If `now` is always 0 or more, the difference never shows. If a negative `now` is possible, a case like `start 0, end 30, now -1` would expect `true` under AC1 but get `false` from the code. Please confirm the valid range of `now`. I did not add this case because it is not in the reviewed table, and the code must stay unchanged.
2. **AC5 (display part) and AC6 are not unit-testable here.** `canBook` returns only `true` or `false`. It does not produce the Available / Unavailable text, a layout, or a reason. That means "understandable validation feedback" (AC6) cannot come from this function: the page cannot tell the user why a request was rejected (past time, too long, blocked or overlap). These need component, E2E or manual tests at desktop and mobile widths. The requirement should also say what message each kind of rejection should show.
3. **Is this really the function the page uses?** The file header says the logic was extracted from `checkAvailability()` in `src/lib/availability.ts`. These tests only cover `src/booking.ts`. Please confirm that `checkAvailability()` now calls `canBook` or has been removed. If it still has its own copy of the conditions, the page could be running untested code.
4. **Inputs the ACs do not define.** The ACs do not say what happens with non-integer minutes, `NaN`, a `now` outside 0–1440, or existing bookings that are invalid (reversed, outside the day, or overlapping each other). They also do not say that `bookings` contains only bookings for the selected room. The code handles some of these by accident (for example, `NaN` gives `false`), but no test covers them because the expected result is not specified.
5. **"After the current time" is read as strictly after.** T02 follows that reading (start = now is rejected). The code does the same, but AC1 could state it explicitly.
````

The first suite was saved to `suites/first/` **before** I changed anything in it: yes

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | `beforeEach` / `afterEach`: `vi.useFakeTimers()` + `vi.setSystemTime(new Date('2026-01-15T09:00:00.000Z'))` | own kind, a fake fixed time: `canBook` never reads the clock, because `now` is a parameter. The frozen clock is also the same 09:00 as `now = 540`, so it cannot catch a version that reads the clock. It only adds a `new Date()` the lab's fixed-time rule forbids | revise: remove the fake timers and `new Date`, keep `now` as the number 540 | AC1 ("the *supplied* current time"): time is an input, so a fixed number is the whole fixture |
| 2 | Every T test and X test: `expectDecision(makeRequest(…), false)`; the only `.toBe(expected)` sits inside the helper | close to *no exception occurred*: the test body shows no assertion, only a bare `true`/`false` argument. Reading T13 alone, I cannot see that it asserts `false`, and a later edit of the helper (e.g. to `toBeDefined`) would weaken all 16 tests at once without touching them | revise: each test writes `expect(decide(…)).toBe(false)` itself; the helper only freezes the data, checks it, and returns the decision | AC1–AC4: the decision is exact, so the exact value belongs in each test |
| 3 | Expected values of T01–T14, X1, X2 | checked for *expected = current output*: I compared every expected value with my section 3 table before running anything; all 16 match the ACs, and T06 (exactly 120 → true) and T01/T08 (touching → true) are right | accept | AC1–AC4 and the section 3 reasons |
| 4 | `import { canBook } from './booking'`, no `vi.mock`, no `.skip`/`.only`, no `test.each` | checked for *mocked booking function*: it imports the real module the page imports (`App.tsx` uses the same `./booking`) | accept | the deck: import the function used by the UI |
| 5 | AC5 test: compares with a hand-typed literal `[{ start: 600, end: 660 }]` | own kind, a copy that is not a copy: the "before" value is typed again, not taken from the data. If the fixture changes, the literal does not follow, and a change undone before the end of the call (push then pop) passes | revise: take `JSON.stringify(request.bookings)` before the call, compare after, and deep-freeze the request so any write throws | AC5: the booking data must not change |
| 6 | Boundaries the table does not reach | *only valid requests* is not the problem (8 of 16 cases expect `false`), but there is no 1-minute overlap, no "first minute after now", no 24:00 twin for T05, and every test uses `now = 540`, so a hard-coded 540 would pass | revise: add R01–R06 from the improvement answer (6.2) | AC1 (supplied now, end ≤ 1440), AC4 (any overlap, even 1 minute) |
| 7 | The assistant's flag 1: AC1 says `0 ≤ start`, code says `start > 0` | real mismatch, but only reachable with `now < 0`, which is not a valid time of day | reject a test for it (`now = -1` is outside the input range); kept as a known limitation in 9.2 | AC1 with `now` in 0–1440 |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text

 RUN  v3.2.7 /home/claude/work/week-07/app

 ✓ src/booking.test.ts (17 tests) 9ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  22:24:47
   Duration  309ms (transform 31ms, setup 0ms, collect 30ms, tests 9ms, environment 0ms, prepare 117ms)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| none | no test failed: 17 passed (17), 1 test file found, no import or runner error | I still checked each expected value against section 3, because a green first run can mean the tests copied the code; they did not | neither: no failure, so no implementation fix; the test repairs come from the review (section 5), not from a failure | kept `booking.ts` unchanged; revised the suite as in section 5 and 6.2 |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.

For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.

Use the actual failure output below. Separate test repairs from implementation fixes.


 RUN  v3.2.7 /home/claude/work/week-07/app

 ✓ src/booking.test.ts (17 tests) 9ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  22:24:47
   Duration  309ms (transform 31ms, setup 0ms, collect 30ms, tests 9ms, environment 0ms, prepare 117ms)
```

The assistant's answer (same chat as the generation prompt), unedited:

````text
# Review of `src/booking.test.ts` against AC1–AC6 and the case table

## 1. What the run output shows

The output you sent has **no failures**: 17 of 17 tests passed (`Tests 17 passed (17)`). That matches what I expected from tracing each case through `canBook`, but it has two consequences:

- **No implementation fix is shown by this run.** No test failed, so the run gives no evidence of a bug. The only possible implementation change below comes from comparing the code with the AC text, not from a failure.
- **A green run does not show the tests are strong.** It only shows the current code agrees with them. The review below asks a different question: which wrong versions of `canBook` would still pass this suite?

## 2. Findings

### 2.1 Incorrect expectations: none found

I checked all 17 expected values against AC1–AC4 and the reviewed table. All of them follow the ACs, not the code. I changed no expected values.

### 2.2 Weak assertions

**W1. The frozen clock is set to the same time as `now`. (Most important.)**
- **Requirement:** AC1 says start must be after the *supplied* current time, which is the `now` parameter, not the system clock.
- **Defect:** The fake clock was 09:00, which is 540 minutes, the same as fixture `now = 540`. A wrong version that reads `new Date()` instead of `now` would get 540 either way and pass every test.
- **Repair:** Freeze the clock at 23:30 (1410 minutes), far from 540. Code that uses the clock would then reject almost every request, and the "true" cases would fail.

**W2. Every test uses `now = 540`.**
- **Requirement:** AC1 again: the decision must use the supplied `now`.
- **Defect:** A version with 540 hard-coded (for example `if (start <= 540)`) passes the whole suite.
- **Repair:** Add a pair of tests with a different `now` (R04 and R05). The same request, 660–720, must be true with `now = 659` and false with `now = 660`.

**W3. The data check compares contents only after the call.**
- **Requirement:** AC5 says the decision must not change the existing booking data.
- **Defect:** A version that changes the data and then puts it back (for example a temporary `sort`, or `push` then `pop`) would pass. So would a version that changes fields on the request object.
- **Repair:** Deep-freeze the request and its bookings before the call. Test files and `booking.ts` are ES modules, which run in strict mode, so any write to a frozen object throws a `TypeError` and fails the test. The before/after comparison stays as a second check.

**W4. The decision is a boolean, so a `false` does not show why it was rejected.**
- **Requirement:** Each AC2–AC4 case is meant to fail for one reason only.
- **Defect:** A version with a broken rule can still return `false` for some other reason. For example, T05 (1380–1441) could be rejected by a wrong rule even if the end-of-day check were missing.
- **Repair:** Give each `false` boundary case a "twin" that changes only the value under test and expects `true`. T06/T07 and T01/T13 already work this way. New twins: R01 for T02 (start one minute after `now`), and R02 for T05 (same start, end exactly 1440).

**W5. The AC5 test has a redundant check.**
- `toHaveLength(1)` is already implied by `toStrictEqual(copyBefore)`, so I removed it. The test still uses an independent literal copy and confirms that the result is Available (the success path).

### 2.3 Duplicated cases: none to remove

Some cases look alike, but each one catches a different wrong overlap or length rule:

| Cases | Why each one is kept |
| --- | --- |
| T09, T10, T11, T12 | A rule that only checks whether the request's start or end falls inside the booking misses T10 (the request contains the booking). A rule that only checks whether the booking's start falls inside the request misses T11 (the request is inside the booking). T12 catches rules that only use strict inequalities on both endpoints. |
| T06 vs X1 | Both are 120 minutes long, but only X1 also tests `end = 1440`. |
| T01 vs T13 | Same interval on purpose. T01 shows that T13's `false` can only come from the block (AC3). |
| AC5 vs the helper | The helper checks data in every test. The AC5 test is the case the table names, with an Available result and an independent copy. |

### 2.4 Missing boundaries

| New ID | Case | AC | Wrong code it would catch |
| --- | --- | --- | --- |
| R01 | 541–571 → true | AC1 | `start <= now + 1`, or any off-by-one that rejects the first allowed minute. It is also the twin for T02. |
| R02 | 1380–1440 → true | AC1 | `end < 1440` (excluding the end of the day). It is also the twin for T05. |
| R03 | 659–720 → false | AC4 | Overlap rules with a tolerance, or rounding, that accept a 1-minute overlap at the booking's end. T09 overlaps by 30 minutes, which is too large to catch this. |
| R04 | 541–601 → false | AC4 | The same as R03, at the booking's start edge (overlap 600–601). |
| R05 | 660–720 with `now = 659` → true | AC1 | `now` hard-coded to 540, or code that ignores the parameter (see W2). |
| R06 | 660–720 with `now = 660` → false | AC1 | Same as R05. Together they prove the decision depends on `now`. |

I checked one more case and kept it out: **start = 0** (`0 ≤ start` in AC1). See section 4.

## 3. Test repairs: revised `src/booking.test.ts`

```ts
// Tests for the booking decision used by the page (src/booking.ts).
// Sources: AC1–AC6, the reviewed case table (T01–T14, AC5, X1, X2)
// and review additions R01–R06.
// Default fixture: now = 540, blocked = false, bookings = [{ start: 600, end: 660 }],
// built fresh for every test.

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { canBook } from './booking';
import type { BookingRequest } from './booking';

// Fixed time. AC1 uses the *supplied* current time (the now parameter, 540 = 09:00).
// The system clock is frozen at 23:30 local time (1410 minutes), deliberately far
// from 540, so any code that reads the real clock instead of `now` gives different
// results and fails.
const FIXED_NOW = 540;
const FIXED_CLOCK = new Date(2026, 0, 15, 23, 30, 0, 0);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_CLOCK);
});

afterEach(() => {
  vi.useRealTimers();
});

// A fresh request every call: new object and new bookings array, never shared between tests.
function makeRequest(
  start: number,
  end: number,
  changes: Partial<Omit<BookingRequest, 'start' | 'end'>> = {},
): BookingRequest {
  return {
    start,
    end,
    now: FIXED_NOW,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
    ...changes,
  };
}

// Freezes the request and its bookings, so any write throws a TypeError (ES modules run in strict mode).
function deepFreeze(request: BookingRequest): BookingRequest {
  request.bookings.forEach((b) => Object.freeze(b));
  Object.freeze(request.bookings);
  return Object.freeze(request);
}

// Checks the exact decision and that the booking data did not change (AC5).
function expectDecision(request: BookingRequest, expected: boolean): void {
  const bookingsRef = request.bookings;
  const bookingsBefore = request.bookings.map((b) => ({ ...b }));

  const decision = canBook(deepFreeze(request));

  expect(decision).toBe(expected);
  expect(request.bookings).toBe(bookingsRef); // same array, not replaced
  expect(request.bookings).toStrictEqual(bookingsBefore); // same contents
}

describe('canBook – AC1: valid interval inside the day, start after now', () => {
  test('T02: 540–570 starts exactly at now (540) → false', () => {
    expectDecision(makeRequest(540, 570), false);
  });

  test('R01: 541–571 starts one minute after now → true (twin of T02)', () => {
    expectDecision(makeRequest(541, 571), true);
  });

  test('T03: 720–720 zero duration → false', () => {
    expectDecision(makeRequest(720, 720), false);
  });

  test('T04: 750–720 reversed interval → false', () => {
    expectDecision(makeRequest(750, 720), false);
  });

  test('T05: 1380–1441 ends past the end of the day → false', () => {
    expectDecision(makeRequest(1380, 1441), false);
  });

  test('R02: 1380–1440 ends exactly at 24:00 → true (twin of T05)', () => {
    expectDecision(makeRequest(1380, 1440), true);
  });

  test('X1: 1320–1440 ends exactly at 24:00 and is 120 minutes → true', () => {
    expectDecision(makeRequest(1320, 1440), true);
  });

  test('R05: 660–720 with now = 659 → true (decision uses the supplied now)', () => {
    expectDecision(makeRequest(660, 720, { now: 659 }), true);
  });

  test('R06: 660–720 with now = 660 → false (start equals the supplied now)', () => {
    expectDecision(makeRequest(660, 720, { now: 660 }), false);
  });
});

describe('canBook – AC2: no longer than 120 minutes', () => {
  test('T06: 720–840 is exactly 120 minutes → true', () => {
    expectDecision(makeRequest(720, 840), true);
  });

  test('T07: 720–841 is 121 minutes → false', () => {
    expectDecision(makeRequest(720, 841), false);
  });
});

describe('canBook – AC3: blocked room', () => {
  test('T13: 660–720 (Available as in T01) but blocked = true → false', () => {
    expectDecision(makeRequest(660, 720, { blocked: true }), false);
  });
});

describe('canBook – AC4: no overlap, touching endpoints allowed', () => {
  test('T01: 660–720 touches the end of 600–660 → true', () => {
    expectDecision(makeRequest(660, 720), true);
  });

  test('T08: 570–600 touches the start of 600–660 → true', () => {
    expectDecision(makeRequest(570, 600), true);
  });

  test('R03: 659–720 overlaps the booking by one minute at its end → false', () => {
    expectDecision(makeRequest(659, 720), false);
  });

  test('R04: 541–601 overlaps the booking by one minute at its start → false', () => {
    expectDecision(makeRequest(541, 601), false);
  });

  test('T09: 630–690 partially overlaps 600–660 → false', () => {
    expectDecision(makeRequest(630, 690), false);
  });

  test('T10: 570–690 contains the whole booking (120 minutes) → false', () => {
    expectDecision(makeRequest(570, 690), false);
  });

  test('T11: 615–645 lies inside the booking → false', () => {
    expectDecision(makeRequest(615, 645), false);
  });

  test('T12: 600–660 is identical to the booking → false', () => {
    expectDecision(makeRequest(600, 660), false);
  });

  test('T14: 630–690 with no bookings → true', () => {
    expectDecision(makeRequest(630, 690, { bookings: [] }), true);
  });

  test('X2: 750–800 is clear of 600–660 but overlaps the second booking 720–780 → false', () => {
    expectDecision(
      makeRequest(750, 800, {
        bookings: [
          { start: 600, end: 660 },
          { start: 720, end: 780 },
        ],
      }),
      false,
    );
  });
});

describe('canBook – AC5: decision does not change existing booking data', () => {
  test('AC5: an Available request leaves the bookings equal to a copy taken before the call', () => {
    const request = deepFreeze(makeRequest(660, 720));
    const bookingsRef = request.bookings;
    const copyBefore = [{ start: 600, end: 660 }];

    const decision = canBook(request);

    expect(decision).toBe(true); // the success path is exercised
    expect(request.bookings).toBe(bookingsRef);
    expect(request.bookings).toStrictEqual(copyBefore);
  });
});
```

**Run command:** `npx vitest run src/booking.test.ts`

The file now has 23 tests. I have not run it. I traced each new case through the current `canBook` code by hand, and I expect all 23 to pass. Your run is the real result.

**Updated AC mapping:**

| AC | Tests |
| --- | --- |
| AC1 | T02, R01, T03, T04, T05, R02, X1, R05, R06 |
| AC2 | T06, T07, X1 |
| AC3 | T13 |
| AC4 | T01, T08, R03, R04, T09, T10, T11, T12, T14, X2 |
| AC5 (data part) | AC5 test, plus the frozen-data and before/after checks in every test |
| AC6 | Not covered by unit tests (see section 4) |

## 4. Implementation fixes, kept separate from test repairs

No failing test supports an implementation fix: the run was 17 of 17 passing. These are open points that need a decision first:

1. **AC1 lower bound (possible fix).** AC1 says `0 ≤ start`, but the code checks `start > 0`. This only makes a difference if `now` can be negative, because the code also needs `start > now`. If the team decides a negative `now` is valid input, this test expresses AC1 and would **fail** against the current code:
   ```ts
   test('AC1: start = 0 is inside the day when now is earlier → true', () => {
     expectDecision(makeRequest(0, 30, { now: -1 }), true);
   });
   ```
   The fix would be to change `start > 0` to `start >= 0` in `src/booking.ts`. If `now` is always 0 or more, the case cannot happen, and only the comment or the AC wording needs to match. I did not add the test to the suite, because the case table does not define a negative `now` and I did not want to invent an expectation.
2. **AC5 (display) and AC6 are not covered.** `canBook` returns only `true` or `false`. It cannot give the reason a request was rejected, which AC6's "understandable validation feedback" needs. Covering this means a design change (for example, returning a reason as well as the decision) plus component or E2E tests at desktop and mobile widths. That is a requirements question, not a bug in the current code.
3. **The page's real code path.** As flagged before: please confirm that `checkAvailability()` in `src/lib/availability.ts` calls `canBook`. If it keeps its own copy of the rules, none of these tests cover what the page actually runs.
````

**What I took from it.** Accepted: the deep-freeze of the request (W3), the twins R01/R02 (W4), the 1-minute overlaps R03/R04, and the `now` pair R05/R06 (W2). I also dropped the redundant `toHaveLength` (W5). Rejected: W1, moving the fake clock to 23:30. `canBook` takes `now` as a parameter, the lab rules forbid `new Date()` in the suite, and R05/R06 already show that the decision follows the supplied `now`, so I removed the fake timers completely. I also kept my own revision 2 from section 5: the exact `.toBe(true|false)` is written in every test, because the answer's revised file still hides it inside `expectDecision`. Not adopted: the `start = 0, now = -1` test (section 5, row 7). Two slips in the answer itself: W2 names the new pair "R04 and R05", but the file calls it R05/R06. W1 says the fake clock equals `now = 540`, but `2026-01-15T09:00:00.000Z` is 09:00 UTC, which is 14:00 in Almaty, so it only equals 540 on a UTC machine.

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
(paste here)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected / Survived | | |
| M2 | Treat touching endpoints as an overlap | Detected / Survived | | |
| M3 | Remove the blocked-room rejection | Detected / Survived | | |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
(paste here)
```

All three changes reverted, and the full suite run again (section 6.3): yes / no

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | | Pass / Fail / Not testable |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | | Pass / Fail / Not testable |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | | Pass / Fail / Not testable |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | | Pass / Fail / Not testable |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | | Pass / Fail / Not testable |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | | |
| Requirements with meaningful tests (AC IDs and gaps) | | |
| Selected mutants detected | | |
| Accepted / revised / rejected tests | | |
| Remaining limitations | | |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

-

---

## 10. Conclusion (120–180 words)

<!-- Answer all three in your own words, without the assistant:
     (a) Which mistake in the FIRST suite would have let a wrong canBook pass, and how did you find it?
     (b) What does your final green run prove, and what does it NOT prove? Use a mutant or a UI check.
     (c) One testing limitation that remains.
     Worthless: "The AI wrote good tests and they all passed."
     Worth everything: "The first suite expected T06 (exactly 120 minutes) to be rejected. That
     contradicts AC2, and it failed on a correct canBook. If I had changed the code to make it
     pass, M1 would have become the real behaviour." -->

<!-- Write your conclusion below this line -->
