# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

## 1. Setup and starting point

| Item | Value |
| --- | --- |
| Assistant (tool) | Claude (claude.ai Project "Ayan software", Claude Code session) |
| Assistant model | Claude Sonnet 5.5 (`claude-sonnet-5-5`) |
| Starting point | week-07 |
| Baseline commit | `47ad596` |
| Language (ts or js) | ts |
| Vitest version | 3.2.7 |
| Where I ran the tests | The assistant's Linux cloud sandbox (Node v22.23.5, `npm install` from the project's package-lock.json), not on my own computer. |

I started from `week-07/app` because that is the app that is on disk in my repository with a passing test suite (23 tests). It is brought into `sis-04/app/` unchanged by the baseline commit.

### 1.1 Baseline run

Run inside the unchanged copy of `week-07/app` (`npm install`, then `npx vitest run`):

```text
RUN  v3.2.7 /home/claude/work/base

 ✓ src/booking.test.ts (23 tests) 6ms

 Test Files  1 passed (1)
      Tests  23 passed (23)
   Start at  18:34:56
   Duration  425ms (transform 63ms, setup 0ms, collect 62ms, tests 6ms, environment 0ms, prepare 136ms)
```

## 2. Context for the assistant

### 2.1 Repository map

```text
week-07/app (the starting point)
  src/main.tsx              — mounts <App/>
  src/App.tsx               — the whole page (453 lines): state, 6 components (Header, RoomList,
                              Timeline, Checker, TimeField, DecisionCard, Rules), the "treat as blocked" checkbox
  src/booking.ts            — canBook(): AC1-AC4 rules, MINUTES_PER_DAY, MAX_BOOKING_MINUTES
  src/lib/availability.ts   — describeDecision(): result wording (re-checks the rules), formatTime, parseTime
  src/lib/rooms.ts          — Room/Booking types and SAMPLE_ROOMS (4 rooms, no equipment)
  src/booking.test.ts       — 23 Vitest tests of canBook (T01-T14, R01-R06, X1-X2, AC5)
  package.json, vite.config.ts, tsconfig*.json, tailwind/postcss/eslint config
```

### 2.2 The context message as sent

I did not write a separate "context message" for a fresh chat. I gave the assistant one message, the assignment brief, and it read the rest itself from the files in my `se-practice` folder (the SIS #04 README sections 5-9, the checker `tests/check_sis.py`, and the code of `week-07/app`). The message I sent, unedited:

```text
SIS #04 - AI-Assisted Software Evolution, Refactoring and Quality Improvement (2 points)
Smart Campus Room Availability Checker: extend your working app with a room
catalog and filters, refactor it into clear modules, keep AC1-AC6, and prove it
with tests and measured evidence. The report is Markdown in your repository
(sis-04/report.md). The PR link pasted here is the submission. No file uploads,
no e-mail. This is NOT Practice #08 again: no planted bugs, no new SKILL.md.
STARTING POINT
   Your Practice #08 app (recommended), or #07, or your SIS #03 page, or
   sis-04/starter/. Bring it into sis-04/app/ UNCHANGED (README section 3), run
   its tests, commit. That commit is your initial version.
```

What the assistant then read for itself in `sis-04/README.md` (the same text every student gets, listed here only to show what it had; it is not a second message I typed):

```text
AC1 Reject start >= end and requests in the past. AC2 Maximum duration 120 minutes. AC3 Reject a blocked room.
AC4 Reject overlaps; touching endpoints allowed. AC5 Available / Unavailable without changing booking data.
AC6 Clear, responsive feedback on desktop and mobile.
F1 capacity >= attendees. F2 the room has ALL selected equipment. F3 a blocked room is never available.
F4 clear empty state when no room matches. F5 changing the room refreshes the result.
Constraints: no login, payments, live APIs or database; fictional data only; fixed names rooms, booking,
filter, canBook, checkRoom, filterRooms.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | The AC1-AC4 rules exist twice: once in `canBook`, and again in the wording code that works out why a request failed. A rule change has to be made in two files or the page tells the wrong reason. | `src/lib/availability.ts`, `describeDecision()` | Lines 33, 41, 48, 55 and 62 repeat `start > 0 && end > start && end <= MINUTES_PER_DAY`, `start <= now`, `duration > MAX_BOOKING_MINUTES`, `blocked`, and `start < b.end && end > b.start`: the same conditions as `canBook()` in `src/booking.ts`. | High |
| 2 | The `Room` type has no equipment, and the catalog lives under `lib/` next to a second shape of booking. F2 cannot be written until the data model changes. | `src/lib/rooms.ts`, `SAMPLE_ROOMS` | The `Room` interface has `id, name, building, capacity, blocked, bookings` and nothing for equipment; all four rooms in `SAMPLE_ROOMS` have no equipment field. | High |
| 3 | One 453-line file holds the page state, the blocked-room rule and seven components, so the page cannot be changed or reasoned about in parts, and a blocked mark is combined with room data in two places. | `src/App.tsx`, `App()` and `RoomList()` | `App()` line 49: `const blocked = selectedRoom.blocked \|\| blockedIds.includes(selectedRoom.id)`; `RoomList()` line 175: `room.blocked \|\| blockedIds.includes(room.id)`. Header, RoomList, Timeline, Checker, TimeField, DecisionCard and Rules are all declared in this one file. | Medium |
| 4 | Nothing tests choosing a room, so a check that used another room's bookings would pass the whole suite (F5). | `src/booking.test.ts` | All 23 tests call `canBook()` with a bookings list they build themselves; there is no test with a catalog or a room id, and the page calls `canBook(request)` with `selectedRoom.bookings` assembled in `App()`. | Medium |
| 5 | The same interval text is built in four places, so a format change must be made four times. | `src/App.tsx` `Timeline()` and `Checker()`, `src/lib/availability.ts` `describeDecision()` | `formatTime(b.start)–formatTime(b.end)` appears in the Timeline `title`, the booking list row, the "Available for" message and the clash message. | Low |

### 3.2 Improvement plan — before editing

1. Bring `week-07/app` into `sis-04/app` unchanged and run its tests (baseline: 23/23). Commit.
2. Write the new tests first, from F1-F5 and B1-B6 in the README, not from code: `filter.test.ts` for `filterRooms` and `room.test.ts` for `checkRoom` (with a fixed catalog inside the file). Run them and see them fail because `filter` and `checkRoom` do not exist. Commit.
3. Add the data and the rules: `src/rooms.ts` (5 rooms with equipment, `ROOMS`, `EQUIPMENT`), `src/filter.ts` (`filterRooms`), `checkRoom` in `src/booking.ts`; show the filter, the rooms that match and the empty state on the page. Run all tests. Commit.
4. Write the tests for the reason behind a "no" (`rejection.test.ts`, order of AC1-AC4) and see them fail. Commit.
5. Refactor: put the reason in `booking.ts` (`explainRejection`, `whyUnavailable`) so the rules exist once; keep `canBook` readable with AC comments; reduce the wording code to `lib/messages.ts` that decides nothing; split `App.tsx` into `components/`; move time helpers to `lib/time.ts`. Run the 23 original tests after each move. Commit.
6. Screenshots, diagrams, report, `AI_USAGE.md`, checker, declaration. Commit.

This plan is committed before any change to `app/src`. The assistant drafted it in the same session in which it later did the work; the order above is the order that was then followed.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| Make `canBook` a one-line wrapper, `return explainRejection(request) === null`, so the rules exist in a single ordered list (risk 1). | Modified | The README says `canBook` is unchanged from Practice #07/#08, the checker (A6) reads the body of `canBook` for the strict overlap test, the 120-minute limit and `blocked`, and the 23 `canBook` tests (T01-T14, AC1-AC5) must stay green. So `canBook` stays the rule function with its AC comments and shares three small predicates with `explainRejection`; the overlap is found by elimination, so no condition is written twice. |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

(write here)

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | (write here) |
| `evidence/filter-empty.png` | (write here) |
| `evidence/switch-a.png` | (write here) |
| `evidence/switch-b.png` | (write here) |
| `evidence/narrow.png` | (write here) |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | (write here) |
| `src/booking.ts` | (write here) |
| `src/filter.ts` | (write here) |
| (write here) | (write here) |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| (write here) | (write here) |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | (write here) | (write here) |
| AC2 | (write here) | (write here) |
| AC3 | (write here) | (write here) |
| AC4 | (write here) | (write here) |
| AC5 | (write here) | (write here) |
| F1 | (write here) | (write here) |
| F2 | (write here) | (write here) |
| F3 | (write here) | (write here) |
| F4 | (write here) | (write here) |
| F5 | (write here) | (write here) |
| B1 | (write here) | (write here) |
| B2 | (write here) | (write here) |
| B3 | (write here) | (write here) |
| B4 | (write here) | (write here) |
| B5 | (write here) | (write here) |
| B6 | (write here) | (write here) |
| INT | (write here) | (write here) |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
(paste here)
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
(paste here)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | (write here) | (write here) | (write here) |
| Duplicated logic locations removed | (write here) | (write here) | (write here) |
| Code structure: modules and their responsibilities | (write here) | (write here) | (write here) |
| Remaining limitation | (write here) | (write here) | (write here) |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.2 Exchange 2

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.3 Exchange 3

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

(write here)
