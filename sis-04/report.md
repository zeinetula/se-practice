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

The catalog is `src/rooms.ts`: 5 fictional rooms (Hawking Hall 101, Curie Lab 202 which is blocked, Turing Lecture 305, Da Vinci Studio 110, Lovelace Seminar 120), each with id, name, building, capacity, equipment list, blocked flag and its own bookings. Six equipment names are available: drawing-tables, lab-bench, microphone, projector, video-conferencing, whiteboard.

The page has a "Find a room" panel: a number box for attendees (F1) and a checkbox per equipment item (F2, all selected items required). `filterRooms` decides which rooms are listed. When nothing matches, the room list shows "No rooms match. Lower the number of attendees or remove some equipment." and the check panel says no room is selected (F4). Blocked rooms stay in the list with a "Blocked" label and are never reported Available (F3, design decision in 5.2). The result is computed from the selected room on every render with `checkRoom` (and `whyUnavailable` for the reason), so choosing another room replaces the old result immediately (F5); if the filter hides the selected room the first listed room is selected instead.

### 4.2 Demonstration

Current time was set to 09:00 in every screenshot.

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | Attendees 10 with projector and whiteboard ticked: "Showing 2 of 5 rooms" and only Hawking Hall 101 (40 seats) and Lovelace Seminar 120 (12 seats), the two rooms with both items. |
| `evidence/filter-empty.png` | Attendees 200: "Showing 0 of 5 rooms", the amber empty-state message "No rooms match", and the check panel saying no room is selected. |
| `evidence/switch-a.png` | All 5 rooms, Hawking Hall 101 selected, 10:30 to 11:00 entered: Available for 30 min (its bookings are 09:00-10:00 and 13:00-14:00). |
| `evidence/switch-b.png` | The same times 10:30 to 11:00 with Turing Lecture 305 selected: Unavailable, "Conflicts with Algorithms 201 (10:00-11:00)", a different result for the same times (F5). |
| `evidence/narrow.png` | The page at phone width, 390 x 2210 portrait: filter, room list, check form and result stacked in one column, Turing Lecture 305 selected with the same Unavailable result. |

## 5. Refactoring (Task 3)

The diagrams are `diagrams/before.puml` and `diagrams/after.puml`.

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | The catalog: `Room` type, `ROOMS` (5 rooms), `EQUIPMENT`. Data only. |
| `src/booking.ts` | The rules: `canBook` (AC1-AC5), `checkRoom` (F3, F5), `explainRejection` and `whyUnavailable` (the reason behind a no). |
| `src/filter.ts` | `filterRooms`: F1 capacity and F2 equipment. |
| `src/App.tsx` | The page: keeps what the user typed, calls the modules above, composes the components. No rule of its own. |
| `src/components/*.tsx` | Presentation only: Header, FilterPanel, RoomList, Timeline, Checker, DecisionCard, TimeField, Rules. |
| `src/lib/messages.ts` | The wording of a result: maps a rejection reason to text; compares nothing. |
| `src/lib/time.ts` | `formatTime`, `formatRange`, `parseTime`, `nowInMinutes`. |

### 5.2 Design decisions

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| The reason for a "no" is computed in `booking.ts` (`explainRejection`) and `lib/messages.ts` only maps reasons to text. | Keep `describeDecision` in the UI and make it repeat the AC1-AC4 conditions, as it did (risk 1). | One place to change a rule; the page cannot say a reason the rules did not give. The `rejection.test.ts` grid test also checks that `explainRejection` is null exactly when `canBook` is true. |
| Blocked rooms stay in the filtered list with a "Blocked" label; `filterRooms` does not look at `blocked`. | Hide blocked rooms inside `filterRooms`. | F1 and F2 are about capacity and equipment only; F3 is the job of `checkRoom`. Showing the room with its label and the reason "Room is blocked" is clearer feedback (AC6) than a room that silently vanishes, and `filterRooms` stays one rule per line. |
| `checkRoom(rooms, roomId, request)` takes the whole catalog and looks the room up by id. | Pass the page's selected room object to `canBook` from `App()`, as before. | The README signature, and it lets the F5 tests prove that the result uses the chosen room's bookings (room d busy at 720-780 does not affect room a). |

### 5.3 Duplication removed

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| `src/lib/availability.ts` `describeDecision()` repeated the AC1-AC4 conditions (valid interval, start after now, 120 minutes, blocked, overlap) already in `canBook()` | `src/booking.ts`: `isValidInterval`, `startsAfter`, `isWithinMax` are used by both `canBook` and `explainRejection`; the overlap is found by elimination; `lib/messages.ts` has no comparisons |
| `src/App.tsx` `App()` line 49 and `RoomList()` line 175 both combined the "treat as blocked" mark with `room.blocked` | One `catalog` value in `App()` applies the mark once; components read `room.blocked` |
| `formatTime(start)–formatTime(end)` written four times (Timeline title, booking row, "Available" message, clash message) | `formatRange()` in `src/lib/time.ts` |

## 6. Automated tests (Task 4)

### 6.1 Test plan

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | `T02 AC1: 540–570 starts exactly at now (540) is rejected` (booking.test.ts) | now 540, 540-570 → false |
| AC2 | `T07 AC2: 720–841, 121 minutes, is rejected` (booking.test.ts) | 720-841 → false |
| AC3 | `T13 AC3: 660–720 in a blocked room is rejected` (booking.test.ts) | blocked room, 660-720 → false |
| AC4 | `T01 AC4: 660–720 touching the end of 600–660 is accepted` (booking.test.ts) | booking 600-660, request 660-720 → true |
| AC5 | `AC5: an Available request leaves the bookings equal to a copy taken before the call` (booking.test.ts) | frozen bookings unchanged, result true |
| F1 | `F1: 9 attendees keeps the rooms with capacity 12, 20 and 40, and drops the 8-seat room` (filter.test.ts) | 9 attendees → rooms b, c, d |
| F2 | `F2: projector + whiteboard keeps only the rooms that have both, not the rooms that have either` (filter.test.ts) | projector + whiteboard → rooms b, c |
| F3 | `F3 AC3: room c is blocked, so 720-780, free of any booking, is rejected` (room.test.ts) | blocked room c, 720-780 → false |
| F4 | `F4 F1: 50 attendees matches no room and returns an empty list` (filter.test.ts) | 50 attendees → [] |
| F5 | `F5: the same times 600-660 are rejected in room a (booked) and available in room b (free)` (room.test.ts) | same request: room a false, room b true |
| B1 | `B1 AC2: exactly 120 minutes (720-840) in room b is available` (room.test.ts) | 720-840 → true |
| B2 | `B2 AC2: 121 minutes (720-841) in room b is rejected` (room.test.ts) | 720-841 → false |
| B3 | `B3 AC4: 660-720 touching the end of room a booking 600-660 is available` (room.test.ts) | 660-720 → true |
| B4 | `B4 AC4: 630-690 overlapping room a booking 600-660 is rejected` (room.test.ts) | 630-690 → false |
| B5 | `B5 F1: capacity exactly equal to the attendees (12 and 12) includes the room` (filter.test.ts) | 12 attendees → room b included |
| B6 | `B6 F1: capacity one below the attendees (12 seats, 13 attendees) excludes the room` (filter.test.ts) | 13 attendees → room b excluded |
| INT | `INT F1 F2 F3 F5: 10 attendees + projector shows b, c, d; at 720-780 only b is available` (room.test.ts) | filterRooms then checkRoom → ['b'] |

Fixed catalogs are inside `filter.test.ts` and `room.test.ts`. The 23 tests of the starting point (T01-T14, R01-R06, X1, X2, AC5) are kept unchanged. `rejection.test.ts` adds 14 tests for the refactoring.

### 6.2 Commands

```text
cd app
npm install
npx vitest run
```

Before the feature code existed the new test files failed because `./filter` was missing (2 test files failed, 23 original tests passed). After the refactoring's new tests were written and before `explainRejection` existed, 14 tests failed with "explainRejection is not a function". Both red runs were real runs of the commands above.

### 6.3 Final run

```text
RUN  v3.2.7 /home/claude/work/asm/sis-04/app

 ✓ src/rejection.test.ts (14 tests) 17ms
 ✓ src/booking.test.ts (23 tests) 18ms
 ✓ src/room.test.ts (10 tests) 8ms
 ✓ src/filter.test.ts (10 tests) 9ms

 Test Files  4 passed (4)
      Tests  57 passed (57)
   Start at  18:40:42
   Duration  1.57s (transform 124ms, setup 0ms, collect 192ms, tests 52ms, environment 1ms, prepare 312ms)
```

## 7. Quality evaluation (Task 5)

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 23/23 | 57/57 | The `Tests` line of the runs in 1.1 and 6.3 (`npx vitest run`). |
| Duplicated logic locations removed | 0 | 3 | Counted in the three rows of 5.3, each pointed at in the code before and after. |
| Code structure: modules and their responsibilities | 8 files under src/ (main, App with 7 components, booking, lib/availability, lib/rooms, booking.test, css, vite-env); rules were in booking.ts and again in lib/availability.ts | 21 files under src/: rooms, booking, filter, App, 8 components, lib/time, lib/messages, 4 test files, main, css, vite-env | `find src -type f` in `app/` at the baseline and at the final code (the same list as `git ls-files app/src`), read against 5.1. |
| Remaining limitation | The page was only checked by looking at it; one rule on the page. | There is no rendered UI test: the page wiring (selected room falling back to the first listed room when the filter hides it, and the "treat as blocked" toggle in `App()`) is checked only by the screenshots in 4.2, not by a test. | From what was built: the INT test covers `filterRooms` then `checkRoom`, but `@testing-library/react` and jsdom were not added, so `App.tsx` has no automated test. |

## 8. AI evidence appendix

### 8.1 Exchange 1

**Tool and model:** Claude (Claude Code session in my claude.ai Project), Claude Sonnet 5.5 (`claude-sonnet-5-5`)
**Date:** 2026-11-22
**Purpose:** Codebase analysis (Task 1): read the starting point and the README and find maintainability risks.

**Prompt:**

```text
SIS #04 - AI-Assisted Software Evolution, Refactoring and Quality Improvement (2 points)
Smart Campus Room Availability Checker: extend your working app with a room catalog and filters, refactor it into clear modules, keep AC1-AC6, and prove it with tests and measured evidence. The report is Markdown in your repository (sis-04/report.md). [...] STARTING POINT: Your Practice #08 app (recommended), or #07, or your SIS #03 page, or sis-04/starter/. Bring it into sis-04/app/ UNCHANGED (README section 3), run its tests, commit. That commit is your initial version.
```

**Output used:**

```text
Risks found in week-07/app: (1) describeDecision() in src/lib/availability.ts re-checks the AC1-AC4 conditions that canBook() already enforces; (2) SAMPLE_ROOMS / the Room type have no equipment, so F2 cannot be expressed; (3) App.tsx is one 453-line file with the blocked-room combination written in App() and in RoomList(); (4) no test chooses a room, so F5 is untested; (5) the same interval text is built in four places.
```

**Problems found:** The assistant first read the packaged week-08 file `week-08/buggy/booking.ts`, which is the Practice #08 planted-bug file (touching bookings rejected, `bookings.push`). That is not a starting point for this assignment ("no planted bugs"), and `week-08/app` is not in my working folder. The assistant chose `week-07/app`, which is on disk with its tests.
**Changes made:** I checked each risk in the code myself (line numbers in 3.1). Starting point declared as week-07.
**Verified by:** Reading `src/lib/availability.ts` lines 33-62, `src/App.tsx` lines 49 and 175, and `src/lib/rooms.ts`; the baseline run of 23 passing tests in 1.1.

### 8.2 Exchange 2

**Tool and model:** Claude (Claude Code session in my claude.ai Project), Claude Sonnet 5.5 (`claude-sonnet-5-5`)
**Date:** 2026-11-22
**Purpose:** The improvement plan (3.2) and the choice of how to remove the duplicated rules without changing `canBook`.

**Prompt:**

```text
(the same single message as 8.1; I sent no separate planning prompt) [...] extend your working app with a room catalog and filters, refactor it into clear modules, keep AC1-AC6, and prove it with tests and measured evidence.
```

**Output used:**

```text
Plan: tests first from F1-F5/B1-B6 (fixed catalogs in the test files), see them fail; add rooms.ts, filter.ts, checkRoom; then move the reason behind a "no" into booking.ts and make lib/messages.ts only map reasons to text; split App.tsx into components; run the original 23 tests after every move. Suggestion: make canBook a wrapper over explainRejection.
```

**Problems found:** The suggested wrapper would change `canBook`, which the README says is unchanged, and check A6 reads `canBook`'s own body for the strict overlap, the 120-minute limit and `blocked`.
**Changes made:** Modified the suggestion (3.3): `canBook` keeps its AC comments and uses three shared predicates; `explainRejection` finds the overlap by elimination and finds the clashing booking by asking `canBook` about each booking alone.
**Verified by:** The 23 original `canBook` tests still pass (57/57 in 6.3); the grid test in `rejection.test.ts` that `explainRejection` is null exactly when `canBook` is true for 162 requests; `python tests/check_sis.py` check A6.

### 8.3 Exchange 3

**Tool and model:** Claude (Claude Code session in my claude.ai Project), Claude Sonnet 5.5 (`claude-sonnet-5-5`)
**Date:** 2026-11-22
**Purpose:** Implementation, tests and refactoring (Tasks 2-4): write the tests, the modules, the components and the screenshots.

**Prompt:**

```text
(the same single message as 8.1; the assistant then worked through the plan in 3.2 on a copy of week-07/app in its sandbox) [...] refactor it into clear modules, keep AC1-AC6, and prove it with tests and measured evidence.
```

**Output used:**

```text
export function filterRooms(rooms: Room[], criteria: Criteria): Room[] {
  return rooms.filter((room) => room.capacity >= criteria.attendees && criteria.equipment.every((item) => room.equipment.includes(item)));
}
export function checkRoom(rooms: Room[], roomId: string, request: RoomRequest): boolean {
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return false;
  return canBook({ ...request, blocked: room.blocked, bookings: room.bookings });
}
```

**Problems found:** The first version of `App.tsx` called only `whyUnavailable`, and check A5 (the page must use `checkRoom` or `canBook`) failed; the first screenshot of `switch-b` was taken in the middle of a CSS transition and showed the old room highlighted. Reading check S6 in `tests/check_sis.py` showed that the `decide()` helper in `booking.test.ts` hides the `canBook` call from it, so B1-B4 were written as new tests that call `checkRoom` directly.
**Changes made:** `App.tsx` now decides with `checkRoom` and asks `whyUnavailable` only for the reason; the screenshots were taken again after a 500 ms wait and checked by eye.
**Verified by:** `npx vitest run` (57/57, 6.3); the two red runs described in 6.2; `python tests/check_sis.py`; looking at all five screenshots.

## 9. Checker results and known fails

| Check | Why it still fails |
| --- | --- |
| L10 | Section 10 (my own-words reflection) is not written yet; it has to be written by me, not by the assistant. |

## 10. AI reflection (Task 6)

своим текстом на 200–300 слов, с четырьмя исправлениями из моего разбора. Если хочешь, пришли черновик сюда, я проверю.
