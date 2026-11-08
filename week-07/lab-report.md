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

```text
(paste here)
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
(paste here)
```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes / no

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | | | accept / revise / reject | |
| 2 | | | accept / revise / reject | |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
(paste here)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| | | | | |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
(paste here)
```

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
