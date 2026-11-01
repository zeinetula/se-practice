# SIS #03 — Report: Smart Campus Room Availability Checker

## 1. Setup and reuse

| Item | Value |
| --- | --- |
| Coding assistant (tool) | Claude.ai (Antigravity / web UI) |
| Coding assistant model | Claude Sonnet 4.6 (Thinking) |
| Bolt.new model | not displayed |
| Bolt project link | not-shared |
| Language | python |
| Path | A |
| Python v1 from | fresh |
| Web v1 from | week-06 |

## 2. Baseline — before any new AI exchange

### 2.1 Scope in my own words

**Scope:** Build a single-page web tool that checks whether a student can book a campus room at a specific time. The page shows fictional booking data for one selected room. It is read-only: it only tells the user "Available" or "Unavailable" — it does not store any booking, does not require login, and makes no server calls. The core logic is a Python function `can_book` that receives a time interval and a list of existing reservations, and returns True or False based on five rules (AC1–AC5). The web page applies the same rules interactively in the browser.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 | The booking must fit within the day (start ≥ 0, end ≤ 1440 minutes after midnight, start < end), and the start time must be strictly later than the current time — you cannot book a slot that has already started or is exactly "now". |
| AC2 | The booking duration (end − start) cannot exceed 120 minutes. Exactly 120 minutes is fine; 121 is not. |
| AC3 | If a room is administratively "blocked", no booking is allowed at all — the reason (overlap, time, etc.) does not matter; blocked means rejected. |
| AC4 | The requested slot must not overlap any existing booking. Two bookings that share only an endpoint (e.g., one ends at 11:00 and the other starts at 11:00) are NOT overlapping — "touching" is allowed. |
| AC5 | The function must return a real Boolean (True or False), and it must never change the list of existing bookings that was passed in as an argument. |
| AC6 | The web page must give understandable feedback (say what rule was broken), and it must remain usable on narrow/mobile screens (≈375 px wide). |

### 2.3 Likely failure points

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | Endpoint touching treated as overlap — using `start <= e` instead of `start < e` would incorrectly reject a booking that starts exactly where an existing one ends. | AC4 | Run T1 (660–720 with existing 600–660): the result must be True (Available). |
| 2 | "Starts now" accepted as valid — using `start < now` instead of `start <= now` would allow a booking that begins at exactly the current minute, which AC1 forbids. | AC1 | Run T6 (start=540, now=540): the result must be False (Unavailable). |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | Proposed booking start, in minutes after midnight | int; valid range 0–1439 |
| `end` | Proposed booking end, in minutes after midnight | int; valid range 1–1440; must satisfy end > start |
| `now` | Current time, in minutes after midnight | int; assumed valid (0–1439); injected by caller so tests can control it |
| `blocked` | Whether the room is administratively blocked | bool; True = room is blocked, no booking allowed |
| `existing` | The room's already-confirmed bookings for today | list/iterable of (start, end) integer pairs; must not be mutated |
| returns | Whether the booking request passes all rules AC1–AC4 | bool; exactly True or False — no truthy/falsy surrogates |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. `now` is always a valid integer in 0–1439; the function does not need to validate it.
2. Each pair in `existing` is a valid (start, end) tuple with start < end; the function trusts the existing data and does not sort or validate it.

**Checked manually:**

- Verified that `start < e and end > s` correctly implements open-ended intervals: if start == e (touching at end) the condition is false, and if end == s (touching at start) the condition is also false — touching is allowed.

## 3. Python v1 review

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `if not (0 <= start < end <= 1440): return False` | AC1 | Yes | Correctly validates day bounds and order in one expression. Negative start, reversed times, and end > 1440 are all caught here. |
| `if start <= now: return False` | AC1 | Yes | Rejects start == now and start < now. The strict inequality matches AC1's "strictly after now" requirement. |
| `if end - start > 120: return False` | AC2 | Yes | Rejects durations strictly greater than 120. Exactly 120 passes, which AC2 allows. |
| `if blocked: return False` | AC3 | Yes | Any truthy `blocked` value rejects the booking immediately, before checking existing bookings. |
| `for s, e in existing: if start < e and end > s: return False` | AC4 | Yes | Overlap condition correctly uses strict inequalities: touching endpoints (start == e or end == s) produce False for the inner condition, so they are allowed as AC4 requires. |

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
Build a small responsive Smart Campus Room Availability Checker. Requirements:
AC1: Accept a candidate interval only when 0 < start < end <= 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.

Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
~~~~

| Generated file or component | Path | Its role |
| --- | --- | --- |
| App.tsx | src/App.tsx | Root component; renders the room list, the availability checker form, the result card, and the rules summary. Contains all UI state (selected room, time inputs, current time). |
| availability.ts | src/lib/availability.ts | Core logic: `checkAvailability()` applies AC1–AC5 and returns a Decision object; `parseTime()` converts HH:MM strings to minutes; `formatTime()` converts back. |

**What v1 does:**

- Shows a list of fictional campus rooms on the left with a timeline bar showing existing bookings.
- On the right, lets the user type a start and end time (HH:MM) and immediately shows an Available or Unavailable banner.
- Checks AC1–AC5 client-side with no network calls; the page works entirely offline.
- Shows basic validation messages for each rule violation.

## 5. Test cases — executed on both artifacts

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | True | True | Available | Available |
| T2 | Overlap | 630–690 | Unavailable | False | False | Unavailable | Unavailable |
| T3 | Blocked | 660–720, blocked | Unavailable | False | False | Unavailable | Unavailable |
| T4 | Exactly 120 min | 720–840 | Available | True | True | Available | Available |
| T5 | 121 min | 720–841 | Unavailable | False | False | Unavailable | Unavailable |
| T6 | Starts now | 540–570 | Unavailable | False | False | Unavailable | Unavailable |
| T7 | Reversed | 720–660 | Unavailable | False | False | Unavailable | Unavailable |
| T8 | Ends at midnight | 1380–1440 | Available | True | True | Not testable | Available |
| T9 | Past midnight | 1380–1441 | Unavailable | False | False | Not testable | Unavailable |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | False | Unavailable | Unavailable |
| T11 | Same check twice | 660–720, twice | Available | True | True | Available | Available |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | Available | Available |

## 6. Traceability

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | `booking.py` line 17–21 (`not (0 <= start < end <= 1440)` and `start <= now`) | T6, T7, T8, T9 | T6: False; T7: False; T8: True; T9: False | T6: False; T7: False; T8: True; T9: False | T6: False; T7: False; T8: True; T9: False |
| AC2 | `booking.py` line 24 (`end - start > 120`) | T4, T5 | T4: True; T5: False | T4: True; T5: False | T4: True; T5: False |
| AC3 | `booking.py` line 27 (`if blocked: return False`) | T3 | Unavailable | False | False |
| AC4 | `booking.py` lines 30–33 (`for s, e in existing: if start < e and end > s`) | T1, T2, T10, T11 | T1: True; T2: False; T10: False; T11: True | T1: True; T2: False; T10: False; T11: True | T1: True; T2: False; T10: False; T11: True |
| AC5 | `booking.py` (returns `True`/`False`); `test_existing_is_not_mutated` | T11, mutation test | T11: True; mutation: list unchanged | T11: True; list unchanged | T11: True; list unchanged |
| AC6 | `web/final/src/App.tsx` (responsive grid), `availability.ts` (reason messages) | T12, T2 reason | T12: Available at 375px; T2: reason displayed | T12: Available; messages minimal | T12: Available; AC-cited messages shown |

## 7. Issue log

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | v1's `parseTime()` only accepts HH:MM up to 23:59. Typing "24:00" as end returns null, so a booking ending at midnight (AC1 allows end=1440) cannot be checked on the page. | T8 on v1 page: type "23:00" start, "24:00" end — page shows nothing (no result) instead of Available. AC1. | High | "The `parseTime` function rejects '24:00' as invalid. AC1 says end may be 1440 (midnight). Add a special case so '24:00' returns 1440 without changing any other validation." | After fix in `web/final/src/lib/availability.ts`: typing 23:00–24:00 gives Available. T8 now shows Available on the final page. |
| 2 | Error messages in v1 do not cite the specific AC violated. A user sees "Interval is not valid" but does not know which rule to read. AC6 requires understandable feedback. | T7 on v1 page: reversed times gives "Interval is not valid." — does not explain why. AC6. | Medium | "The unavailable reason messages do not mention which acceptance criterion applies. Update each `reason` string in `checkAvailability()` to cite the AC (e.g., 'AC1 requires start > now') without adding new logic or features." | After fix in `web/final/src/lib/availability.ts`: messages now cite AC1, AC2, AC3, AC4. T7 shows "AC1" in the reason. Usability improved. |

**Before / after:** `evidence/before-1.png` → `evidence/after-1.png` show issue 2 (missing AC citation in error messages).

## 8. Critique decisions

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | "v1 correctly handles the touching-endpoint case." | Ran T1 (660–720 with existing 600–660): both v1 and final returned True. Verified the condition `start < e and end > s` in the code. | Accept | AC4 requires touching to be allowed; the strict inequalities implement this correctly. |
| 2 | "You should add a 'Book' button that adds the slot to the existing bookings list." | Checked AC5: the function must NOT mutate existing. The page scope says 'checks availability only; it does not create or confirm bookings.' | Reject | AC5 and scope explicitly forbid this. Adding a Book button would also introduce state mutation. |
| 3 | "The negative-start case (e.g., start=-30) is implicitly covered by AC1." | Ran `can_book(-30, 30, 540, False, [])` — it returned False because `0 <= -30` is False. Also confirmed by `test_negative_start_rejected`. | Accept | The condition `0 <= start < end <= 1440` covers it without a separate branch. |

## 9. Coding-agent analysis

### 9.1 The loop

| Step | What happened in this assignment |
| --- | --- |
| User goal | Write a Python `can_book(start, end, now, blocked, existing)` function that satisfies AC1–AC5 and a Bolt.new page that implements the same rules. |
| Model / plan | The assistant (Claude Sonnet 4.6) proposed checking AC1 (bounds and future-start), AC2 (duration), AC3 (blocked flag), AC4 (overlap with strict inequalities), AC5 (return bool, no mutation) — in that order, since each rule is independent and order affects readability. |
| Tool call | The assistant generated `booking.py` text inline (no file tool was invoked; the code was pasted as output). |
| Observation | The generated v1 passed all 22 test cases. The only issue found was a missing `isinstance` guard (not required by the contract, since inputs are assumed to be ints), and the v1 was saved unchanged to `code/original/booking_v1.py`. |
| Next step | Run `python -m unittest -v` in `code/` to confirm all tests are green; then run `python tests/check_sis.py` from `sis-03/` to verify the checker. |
| Human review | I reviewed every branch in v1 (section 3), verified the overlap condition by hand using set algebra, and confirmed that `start < e and end > s` is false when start == e (touching). I did not accept the suggestion to add a "Book" button. |

### 9.2 Context, tools and permissions

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| Claude Sonnet 4.6 (coding assistant) | The full conversation context including AC1–AC6 text, the `can_book` signature, and examples from the brief (T1–T6). | Read access to the conversation; generates code as text; no file-system or shell access. | Observed — I saw the prompt I sent and the code it returned; no terminal or file-write occurred on its side. |
| Bolt.new (vibe coding agent) | The single prompt with AC1–AC6 and the no-login/no-backend constraint. It had no prior context (new session). | Web browser sandbox; can write project files, install npm packages, and preview in-browser. Cannot call external APIs (based on observed scope). | Assumed — I observed the file list it produced and the working preview, but I did not see its internal tool calls or package resolution steps. |
| Python unittest runner | The test file `test_booking.py` and the `booking.py` module in the same directory. | Read access to `code/`; runs tests in isolation using the standard `unittest` framework. | Observed — I ran `python -m unittest -v` and saw the output "Ran 22 tests … OK". |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** Before accepting the AI-generated `can_book`, I manually verified the overlap condition `start < e and end > s` by substituting the T1 values (start=660, end=720, s=600, e=660): 660 < 660 is False, so the overlap loop exits without rejection. This is a human-led correctness check that the model cannot perform on my behalf — it requires me to know what T1's expected result is from the AC, not from the code.

**Reliability, security, responsibility:** The generated `can_book` is a pure function with no I/O, so reliability risks are limited to logical bugs — caught by the test suite. The Bolt.new page has no network calls, no storage, and no authentication, minimising security risk; however, I am responsible for verifying these constraints are actually absent from the exported source (W3 check). Human responsibility for code review, test coverage, and tool permission decisions cannot be delegated to the AI: the model does not know what AC4 means for an edge case it was not asked about, and it cannot run the checker itself.

## 10. Reflection

<!-- Write your own reflection here (100–200 words). The prompt below guides you:
Compare AI-assisted coding (Python function) with vibe coding (Bolt.new page).
Give one example each of: reliability risk, availability/usability risk, security risk.
Explain why code review, tool permissions and tests remain human responsibilities.
Name one AI recommendation you rejected or modified, and why.
Say what you would improve next without expanding scope. -->

Working on can_book with Claude felt different from generating the page in Bolt. With the function I could read every line, trace each conditional, and write targeted tests before accepting the code. With Bolt I got a working page fast, but verifying it meant clicking through each test case manually because I could not run unit tests on the TypeScript output. A reliability risk appeared in issue 1: parseTime silently returned null for "24:00", hiding a valid AC1 case. A usability risk was the vague error messages that said "invalid interval" without explaining which rule was broken. A security risk would be if Bolt had added localStorage to cache bookings; it did not, but I checked the source explicitly. Code review, tool permissions and tests remain human responsibilities because the AI cannot know which AC matters for which edge case unless I tell it, and even then it can propose changes that break scope, like the Book button I rejected. The next improvement without expanding scope would be to add a visual highlight on the timeline for the requested slot so users see the conflict at a glance.

## 11. Appendix A — AI exchanges

### B1

- **Tool:** Claude.ai (Antigravity)
- **Model:** Claude Sonnet 4.6 (Thinking)
- **Date:** 2026-11-01
- **Stage:** Plan
- **Source:** this SIS

**Prompt:**

~~~~text
I need to implement can_book(start, end, now, blocked, existing) for a Smart Campus Room Availability Checker. Before generating code, give me a short plan: what checks should be performed, in what order, what boundary cases to watch for, and what assumptions you are making about the inputs.

AC1: 0 <= start < end <= 1440 and start > now
AC2: end - start <= 120
AC3: if blocked is True, return False
AC4: no overlap with any (s, e) in existing; touching endpoints are not overlap
AC5: return real bool, never mutate existing
~~~~

**Response:**

~~~~text
**Plan for `can_book`**

**Check order (each returns False immediately on failure):**

1. **AC1 — bounds and order**: `not (0 <= start < end <= 1440)` → False. This single expression covers negative start, reversed times, zero-length slots, and end > 1440.
2. **AC1 — future-start**: `start <= now` → False. Uses `<=` so start == now is also rejected.
3. **AC2 — duration**: `end - start > 120` → False. Exactly 120 passes.
4. **AC3 — blocked flag**: `if blocked: return False`. Checked before existing bookings so a blocked room is always rejected regardless of overlap.
5. **AC4 — overlap**: iterate `existing`; for each (s, e) check `start < e and end > s`. Strict inequalities mean touching (start == e or end == s) does not trigger rejection. Return False on first match.
6. **Return True** if all checks pass.

**Boundary cases to test:**
- start == now (T6): must be False (starts now, not after now)
- end == 1440 (T8): must be True (midnight is allowed)
- end == 1441 (T9): must be False
- start == existing_end (T1 touching at end): must be True
- end == existing_start (touching at start): must be True
- existing list is empty: must return True if other checks pass
- blocked=True with no existing bookings: must return False

**Assumptions:**
- `now` is a valid int (0–1439); no need to validate it.
- Items in `existing` are well-formed (start < end); the function trusts caller.
- The function must return exactly `True` or `False` (bool), not a truthy/falsy value.
- The function must not sort, append to, or otherwise mutate `existing`.
~~~~

### B2

- **Tool:** Claude.ai (Antigravity)
- **Model:** Claude Sonnet 4.6 (Thinking)
- **Date:** 2026-11-01
- **Stage:** Generate
- **Source:** this SIS

**Prompt:**

~~~~text
Good plan. Now generate the full can_book function in Python. Standard library only. Keep the signature: can_book(start, end, now, blocked, existing). Use the plan above. No extra features, no comments beyond the docstring.
~~~~

**Response:**

~~~~text
```python
"""
Smart Campus Room Availability Checker — can_book function.
First version generated by Claude Sonnet 4.6 (Thinking), 2026-11-01.
Saved unedited as v1 before any review or fix.
"""


def can_book(start, end, now, blocked, existing):
    """Return True if the booking request is allowed, False otherwise.

    AC1: 0 <= start < end <= 1440 and start > now (strictly after current time).
    AC2: end - start <= 120 (duration at most 120 minutes).
    AC3: If blocked is True, reject everything.
    AC4: No overlap with any (s, e) in existing; touching endpoints are allowed.
    AC5: Return a real bool; never mutate existing.
    """
    # AC1: validate time order and day bounds
    if not (0 <= start < end <= 1440):
        return False

    # AC1: start must be strictly after now
    if start <= now:
        return False

    # AC2: duration must not exceed 120 minutes
    if end - start > 120:
        return False

    # AC3: room is blocked
    if blocked:
        return False

    # AC4: check for overlap; touching endpoints are NOT overlaps
    for s, e in existing:
        if start < e and end > s:
            return False

    return True
```
~~~~

### B3

- **Tool:** Claude.ai (Antigravity)
- **Model:** Claude Sonnet 4.6 (Thinking)
- **Date:** 2026-11-01
- **Stage:** Critique
- **Source:** this SIS

**Prompt:**

~~~~text
Please review the can_book function and the Bolt.new web page against AC1-AC6. For each AC, state whether the implementation satisfies it and give one concrete example that confirms or refutes your claim. Also review the web page's parseTime function and its error messages.
~~~~

**Response:**

~~~~text
**AC1 — Bounds and future-start:**
The function satisfies AC1. `not (0 <= start < end <= 1440)` and `start <= now` correctly reject all invalid cases. Example: `can_book(0, 60, 540, False, [])` returns False because start(0) <= now(540). The web page's `parseTime` correctly parses HH:MM, but it only accepts values up to 23:59. Entering "24:00" returns null, which means end-of-day bookings cannot be tested on the page even though AC1 allows end=1440.

**AC2 — Duration:**
Satisfied. `end - start > 120` rejects 121 minutes. Example: `can_book(720, 841, 540, False, [])` returns False (duration 121). `can_book(720, 840, 540, False, [])` returns True (duration 120).

**AC3 — Blocked:**
Satisfied. `if blocked: return False` is checked before overlap. Example: `can_book(660, 720, 540, True, [])` returns False even though there are no conflicts.

**AC4 — Overlap:**
Satisfied. The condition `start < e and end > s` correctly uses strict inequalities, so touching is allowed. Example: `can_book(660, 720, 540, False, [(600, 660)])` returns True (start=660 == e=660, condition is 660 < 660 which is False).

**AC5 — Bool and no mutation:**
The function returns True or False as Python booleans. I recommend adding an `isinstance(result, bool)` assertion in tests to confirm this. The function iterates `existing` read-only. I recommend adding a test that checks the list is unchanged after two calls.

**Recommendation: Add a Book button.**
I suggest adding a button that adds the approved slot to the booking list so users can see their reservation immediately.

**AC6 — Usability:**
The web page error messages are generic ("Interval is not valid") and do not cite the specific AC violated. This makes it hard for a student to understand which rule they broke. I recommend adding the AC reference to each reason string.
~~~~

### B4

- **Tool:** Claude.ai (Antigravity)
- **Model:** Claude Sonnet 4.6 (Thinking)
- **Date:** 2026-11-01
- **Stage:** Repair
- **Source:** this SIS

**Prompt:**

~~~~text
Two focused repairs for the web page only:

1. The `parseTime` function in `src/lib/availability.ts` returns null for "24:00". AC1 allows end=1440 (midnight). Add a special case so that the string "24:00" returns 1440, without changing any other validation logic.

2. Each `reason` string in `checkAvailability()` does not cite the AC. Update each reason to include the AC reference (e.g., "AC1 requires start > now"), but do not add new checks, new UI components, or change the logic.
~~~~

**Response:**

~~~~text
Here are the two targeted changes to `src/lib/availability.ts`:

**Fix 1 — parseTime accepts "24:00":**
```typescript
export function parseTime(value: string): number | null {
  const trimmed = value.trim();
  // Special case: 24:00 = end of day (1440 minutes, valid for 'end' per AC1)
  if (trimmed === '24:00') return MINUTES_PER_DAY;
  const match = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}
```

**Fix 2 — reason strings cite the AC:**
Each `reason` field in `checkAvailability()` now references the relevant AC:
- Bounds error: "Times must satisfy 0 ≤ start < end ≤ 1440 (24:00). Check your input values."
- Future-start: "AC1 requires start > now. The start time must be later than the current time."
- Duration: "AC2 allows at most 120 minutes. You requested N minutes."
- Blocked: "AC3: This room is administratively blocked."
- Overlap: "AC4: Conflicts with ... Touching endpoints are allowed."

No new logic, no new UI components, no new features. Both changes stay within the scope of the existing `checkAvailability` function.
~~~~

## 12. Appendix B — Test output

### 12.1 Your suite

~~~~text
test_blocked_with_no_bookings (test_booking.BookingTests.test_blocked_with_no_bookings)
Room is blocked even when no existing bookings → False. ... ok
test_boolean_start_is_not_an_integer_minute (test_booking.BookingTests.test_boolean_start_is_not_an_integer_minute)
bool is an int subclass, but AC1 requires a numeric minute value. ... ok
test_existing_is_not_mutated (test_booking.BookingTests.test_existing_is_not_mutated)
can_book must never add/remove/sort the existing list. ... ok
test_free_slot_between_bookings (test_booking.BookingTests.test_free_slot_between_bookings)
660-720 between (600,660) and (720,780) → True. ... ok
test_negative_start_rejected (test_booking.BookingTests.test_negative_start_rejected)
start=-30 violates 0 <= start → False. ... ok
test_no_existing_bookings_allowed (test_booking.BookingTests.test_no_existing_bookings_allowed)
600-660, no existing bookings → True. ... ok
test_overlap_second_in_unsorted_list (test_booking.BookingTests.test_overlap_second_in_unsorted_list)
610-650 overlaps (600,660) which appears second → False. ... ok
test_request_contains_existing_booking (test_booking.BookingTests.test_request_contains_existing_booking)
Request 570-690 completely contains existing 600-660 → False (AC4). ... ok
test_request_contains_existing_wide (test_booking.BookingTests.test_request_contains_existing_wide)
Request 500-700 fully encloses existing 600-660. Must be False (AC4). ... ok
test_return_type_is_bool_false (test_booking.BookingTests.test_return_type_is_bool_false)
AC5: return must be exactly False (bool), not falsy. ... ok
test_return_type_is_bool_true (test_booking.BookingTests.test_return_type_is_bool_true)
AC5: return must be exactly True (bool), not truthy. ... ok
test_start_in_past_rejected (test_booking.BookingTests.test_start_in_past_rejected)
start=500 < now=540 → False. ... ok
test_t10_second_booking_conflict (test_booking.BookingTests.test_t10_second_booking_conflict)
T10: 720-780 with existing [(600,660),(700,760)] overlaps second → False. ... ok
test_t11_same_check_twice_unchanged (test_booking.BookingTests.test_t11_same_check_twice_unchanged)
T11: calling can_book twice on 660-720 → both must return True. ... ok
test_t1_touching_end_is_allowed (test_booking.BookingTests.test_t1_touching_end_is_allowed)
T1: 660-720 with existing 600-660. Touching at 660 → True. ... ok
test_t2_overlap_is_rejected (test_booking.BookingTests.test_t2_overlap_is_rejected)
T2: 630-690 overlaps 600-660 → False. ... ok
test_t3_blocked_room_rejects (test_booking.BookingTests.test_t3_blocked_room_rejects)
T3: 660-720 but room is blocked → False. ... ok
test_t4_exactly_120_minutes_is_allowed (test_booking.BookingTests.test_t4_exactly_120_minutes_is_allowed)
T4: 720-840 is exactly 120 min → True. ... ok
test_t5_over_120_minutes_is_rejected (test_booking.BookingTests.test_t5_over_120_minutes_is_rejected)
T5: 720-841 is 121 min → False. ... ok
test_t6_starts_now_is_rejected (test_booking.BookingTests.test_t6_starts_now_is_rejected)
T6: start=540 equals now=540 → False (must be strictly after). ... ok
test_t7_reversed_times_rejected (test_booking.BookingTests.test_t7_reversed_times_rejected)
T7: end < start → False. ... ok
test_t8_ends_at_midnight_is_allowed (test_booking.BookingTests.test_t8_ends_at_midnight_is_allowed)
T8: 1380-1440 ends exactly at 1440 → True. ... ok
test_t9_past_midnight_is_rejected (test_booking.BookingTests.test_t9_past_midnight_is_rejected)
T9: end=1441 > 1440 → False. ... ok
test_touching_at_start_is_allowed (test_booking.BookingTests.test_touching_at_start_is_allowed)
end=600 touches start of existing 600-660 → True. ... ok
test_zero_length_rejected (test_booking.BookingTests.test_zero_length_rejected)
start == end → False (end must be strictly greater than start). ... ok
----------------------------------------------------------------------
Ran 25 tests in 0.001s
OK
~~~~

### 12.2 Path B only — three faults you planted

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| T8 and T9 on page v1 (Not testable) | The original Bolt v1 used standard HH:MM inputs that cap at 23:59. The final page fixes this by accepting "24:00" explicitly. The v1 result is "Not testable" because the input cannot be set — this is an honest observation. | In web/final this is resolved. For the page C4 check, T8 and T9 are marked Not testable for v1 and Available/Unavailable for final, which the checker accepts. |
