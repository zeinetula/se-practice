# Week 08 — Lab report

**Name:** Ayan Zeinetula (24B031804)
**Group:** 3rd year, SITE IS
**Date:** 8 November 2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I debugged with (tool) | Claude (Claude Code agent session, fresh sub-sessions for the two chats) |
| Exact model (with its version, or `not displayed`) | Claude Opus 5.5 (claude-opus-5-5) |
| Where the skill was installed (ChatGPT / Claude web / Claude Code / prompt-only simulation) | prompt-only simulation |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | Linux workspace of the agent session (Node + `npx vitest run` in week-08/app) |
| Vitest version (the `RUN  v…` line of a run) | 3.2.7 |
| Language of my booking module (`ts` or `js`) — the file I copied from `buggy/` | ts |

---

## 2. Task 1 — baseline, buggy code, failing tests

### 2.1 My Week 07 suite on my own code

The **real** output of your Week 07 suite, run in `week-08/app/` **before** you replace
anything. It should be green. If it is not, say why under the block.

```text

 RUN  v3.2.7 /home/claude/repo/week-08/app

 ✓ src/booking.test.ts (23 tests) 6ms

 Test Files  1 passed (1)
      Tests  23 passed (23)
   Start at  23:04:36
   Duration  435ms (transform 53ms, setup 0ms, collect 49ms, tests 6ms, environment 0ms, prepare 110ms)
```

### 2.2 The same suite on the provided canBook

You copied the whole `canBook` function from `buggy/booking.ts` (or `.js`) over yours and changed
nothing else. This is the real output:

```text

 RUN  v3.2.7 /home/claude/repo/week-08/app

 ❯ src/booking.test.ts (23 tests | 9 failed) 17ms
   ✓ AC1: valid interval inside the day, start after the supplied now > T02 AC1: 540–570 starts exactly at now (540) is rejected 2ms
   × AC1: valid interval inside the day, start after the supplied now > R01 AC1: 541–571 starts one minute after now is accepted (pair of the starts-now case) 4ms
     → Cannot add property 1, object is not extensible
   ✓ AC1: valid interval inside the day, start after the supplied now > T03 AC1: 720–720 zero duration is rejected 0ms
   ✓ AC1: valid interval inside the day, start after the supplied now > T04 AC1: 750–720 reversed interval is rejected 0ms
   ✓ AC1: valid interval inside the day, start after the supplied now > T05 AC1: 1380–1441 past the end of the day is rejected 0ms
   × AC1: valid interval inside the day, start after the supplied now > R02 AC1: 1380–1440 ending exactly at 24:00 is accepted (pair of the past-day-end case) 0ms
     → Cannot add property 1, object is not extensible
   × AC1: valid interval inside the day, start after the supplied now > X1 AC1 AC2: 1320–1440 ends at 24:00 and lasts exactly 120 minutes, accepted 0ms
     → Cannot add property 1, object is not extensible
   × AC1: valid interval inside the day, start after the supplied now > R05 AC1: 660–720 with now = 659 is accepted (the supplied now is used) 4ms
     → expected false to be true // Object.is equality
   ✓ AC1: valid interval inside the day, start after the supplied now > R06 AC1: 660–720 with now = 660 is rejected (start equals the supplied now) 0ms
   × AC2: no longer than 120 minutes > T06 AC2: 720–840, exactly 120 minutes, is accepted 0ms
     → Cannot add property 1, object is not extensible
   ✓ AC2: no longer than 120 minutes > T07 AC2: 720–841, 121 minutes, is rejected 0ms
   ✓ AC3: blocked room > T13 AC3: 660–720 in a blocked room is rejected 2ms
   × AC4: no overlap, touching endpoints allowed > T01 AC4: 660–720 touching the end of 600–660 is accepted 1ms
     → expected false to be true // Object.is equality
   × AC4: no overlap, touching endpoints allowed > T08 AC4: 570–600 touching the start of 600–660 is accepted 1ms
     → expected false to be true // Object.is equality
   ✓ AC4: no overlap, touching endpoints allowed > R03 AC4: 659–720 overlapping the booking by one minute at its end is rejected 0ms
   ✓ AC4: no overlap, touching endpoints allowed > R04 AC4: 541–601 overlapping the booking by one minute at its start is rejected 0ms
   ✓ AC4: no overlap, touching endpoints allowed > T09 AC4: 630–690 partial overlap is rejected 0ms
   ✓ AC4: no overlap, touching endpoints allowed > T10 AC4: 570–690 containing the whole booking is rejected 0ms
   ✓ AC4: no overlap, touching endpoints allowed > T11 AC4: 615–645 inside the booking is rejected 0ms
   ✓ AC4: no overlap, touching endpoints allowed > T12 AC4: 600–660 identical to the booking is rejected 0ms
   × AC4: no overlap, touching endpoints allowed > T14 AC4: 630–690 with no bookings is accepted 0ms
     → Cannot add property 0, object is not extensible
   ✓ AC4: no overlap, touching endpoints allowed > X2 AC4: 750–800 clear of 600–660 but overlapping the second booking 720–780 is rejected 0ms
   × AC5: the decision does not change the existing booking data > AC5: an Available request leaves the bookings equal to a copy taken before the call 0ms
     → expected false to be true // Object.is equality

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 9 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > AC1: valid interval inside the day, start after the supplied now > R01 AC1: 541–571 starts one minute after now is accepted (pair of the starts-now case)
TypeError: Cannot add property 1, object is not extensible
 ❯ Module.canBook src/booking.ts:36:12
     34|   }
     35|   // keep the room's list current with the slot that was just found fr…
     36|   bookings.push({ start, end });
       |            ^
     37|   return true;
     38| }
 ❯ decide src/booking.test.ts:43:20
 ❯ src/booking.test.ts:54:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/9]⎯

 FAIL  src/booking.test.ts > AC1: valid interval inside the day, start after the supplied now > R02 AC1: 1380–1440 ending exactly at 24:00 is accepted (pair of the past-day-end case)
TypeError: Cannot add property 1, object is not extensible
 ❯ Module.canBook src/booking.ts:36:12
     34|   }
     35|   // keep the room's list current with the slot that was just found fr…
     36|   bookings.push({ start, end });
       |            ^
     37|   return true;
     38| }
 ❯ decide src/booking.test.ts:43:20
 ❯ src/booking.test.ts:70:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/9]⎯

 FAIL  src/booking.test.ts > AC1: valid interval inside the day, start after the supplied now > X1 AC1 AC2: 1320–1440 ends at 24:00 and lasts exactly 120 minutes, accepted
TypeError: Cannot add property 1, object is not extensible
 ❯ Module.canBook src/booking.ts:36:12
     34|   }
     35|   // keep the room's list current with the slot that was just found fr…
     36|   bookings.push({ start, end });
       |            ^
     37|   return true;
     38| }
 ❯ decide src/booking.test.ts:43:20
 ❯ src/booking.test.ts:74:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/9]⎯

 FAIL  src/booking.test.ts > AC1: valid interval inside the day, start after the supplied now > R05 AC1: 660–720 with now = 659 is accepted (the supplied now is used)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:78:57
     76| 
     77|   test('R05 AC1: 660–720 with now = 659 is accepted (the supplied now …
     78|     expect(decide(makeRequest(660, 720, { now: 659 }))).toBe(true);
       |                                                         ^
     79|   });
     80| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/9]⎯

 FAIL  src/booking.test.ts > AC2: no longer than 120 minutes > T06 AC2: 720–840, exactly 120 minutes, is accepted
TypeError: Cannot add property 1, object is not extensible
 ❯ Module.canBook src/booking.ts:36:12
     34|   }
     35|   // keep the room's list current with the slot that was just found fr…
     36|   bookings.push({ start, end });
       |            ^
     37|   return true;
     38| }
 ❯ decide src/booking.test.ts:43:20
 ❯ src/booking.test.ts:88:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/9]⎯

 FAIL  src/booking.test.ts > AC4: no overlap, touching endpoints allowed > T01 AC4: 660–720 touching the end of 600–660 is accepted
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:104:43
    102| describe('AC4: no overlap, touching endpoints allowed', () => {
    103|   test('T01 AC4: 660–720 touching the end of 600–660 is accepted', () …
    104|     expect(decide(makeRequest(660, 720))).toBe(true);
       |                                           ^
    105|   });
    106| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/9]⎯

 FAIL  src/booking.test.ts > AC4: no overlap, touching endpoints allowed > T08 AC4: 570–600 touching the start of 600–660 is accepted
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:108:43
    106| 
    107|   test('T08 AC4: 570–600 touching the start of 600–660 is accepted', (…
    108|     expect(decide(makeRequest(570, 600))).toBe(true);
       |                                           ^
    109|   });
    110| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/9]⎯

 FAIL  src/booking.test.ts > AC4: no overlap, touching endpoints allowed > T14 AC4: 630–690 with no bookings is accepted
TypeError: Cannot add property 0, object is not extensible
 ❯ Module.canBook src/booking.ts:36:12
     34|   }
     35|   // keep the room's list current with the slot that was just found fr…
     36|   bookings.push({ start, end });
       |            ^
     37|   return true;
     38| }
 ❯ decide src/booking.test.ts:43:20
 ❯ src/booking.test.ts:136:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/9]⎯

 FAIL  src/booking.test.ts > AC5: the decision does not change the existing booking data > AC5: an Available request leaves the bookings equal to a copy taken before the call
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:158:22
    156|     const decision = canBook(deepFreeze(request));
    157| 
    158|     expect(decision).toBe(true); // the success path, where a booking …
       |                      ^
    159|     expect(request.bookings).toBe(sameArray);
    160|     expect(JSON.stringify(request.bookings)).toBe(before);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/9]⎯


 Test Files  1 failed (1)
      Tests  9 failed | 14 passed (23)
   Start at  23:04:37
   Duration  394ms (transform 64ms, setup 0ms, collect 53ms, tests 17ms, environment 0ms, prepare 85ms)
```

### 2.3 One failing test per bug

Add the two regression tests from README Part 1, step 5: one named `BUG-A` and one named `BUG-B`.
Run them **on the buggy code**. Both must fail here. That is the evidence that each test can see
its bug.

```text

 RUN  v3.2.7 /home/claude/repo/week-08/app

 ❯ src/booking.test.ts (25 tests | 11 failed) 24ms
   ✓ AC1: valid interval inside the day, start after the supplied now > T02 AC1: 540–570 starts exactly at now (540) is rejected 3ms
   × AC1: valid interval inside the day, start after the supplied now > R01 AC1: 541–571 starts one minute after now is accepted (pair of the starts-now case) 5ms
     → Cannot add property 1, object is not extensible
   ✓ AC1: valid interval inside the day, start after the supplied now > T03 AC1: 720–720 zero duration is rejected 0ms
   ✓ AC1: valid interval inside the day, start after the supplied now > T04 AC1: 750–720 reversed interval is rejected 0ms
   ✓ AC1: valid interval inside the day, start after the supplied now > T05 AC1: 1380–1441 past the end of the day is rejected 0ms
   × AC1: valid interval inside the day, start after the supplied now > R02 AC1: 1380–1440 ending exactly at 24:00 is accepted (pair of the past-day-end case) 0ms
     → Cannot add property 1, object is not extensible
   × AC1: valid interval inside the day, start after the supplied now > X1 AC1 AC2: 1320–1440 ends at 24:00 and lasts exactly 120 minutes, accepted 0ms
     → Cannot add property 1, object is not extensible
   × AC1: valid interval inside the day, start after the supplied now > R05 AC1: 660–720 with now = 659 is accepted (the supplied now is used) 3ms
     → expected false to be true // Object.is equality
   ✓ AC1: valid interval inside the day, start after the supplied now > R06 AC1: 660–720 with now = 660 is rejected (start equals the supplied now) 0ms
   × AC2: no longer than 120 minutes > T06 AC2: 720–840, exactly 120 minutes, is accepted 0ms
     → Cannot add property 1, object is not extensible
   ✓ AC2: no longer than 120 minutes > T07 AC2: 720–841, 121 minutes, is rejected 2ms
   ✓ AC3: blocked room > T13 AC3: 660–720 in a blocked room is rejected 0ms
   × AC4: no overlap, touching endpoints allowed > T01 AC4: 660–720 touching the end of 600–660 is accepted 0ms
     → expected false to be true // Object.is equality
   × AC4: no overlap, touching endpoints allowed > T08 AC4: 570–600 touching the start of 600–660 is accepted 1ms
     → expected false to be true // Object.is equality
   ✓ AC4: no overlap, touching endpoints allowed > R03 AC4: 659–720 overlapping the booking by one minute at its end is rejected 0ms
   ✓ AC4: no overlap, touching endpoints allowed > R04 AC4: 541–601 overlapping the booking by one minute at its start is rejected 0ms
   ✓ AC4: no overlap, touching endpoints allowed > T09 AC4: 630–690 partial overlap is rejected 0ms
   ✓ AC4: no overlap, touching endpoints allowed > T10 AC4: 570–690 containing the whole booking is rejected 0ms
   ✓ AC4: no overlap, touching endpoints allowed > T11 AC4: 615–645 inside the booking is rejected 0ms
   ✓ AC4: no overlap, touching endpoints allowed > T12 AC4: 600–660 identical to the booking is rejected 0ms
   × AC4: no overlap, touching endpoints allowed > T14 AC4: 630–690 with no bookings is accepted 0ms
     → Cannot add property 0, object is not extensible
   ✓ AC4: no overlap, touching endpoints allowed > X2 AC4: 750–800 clear of 600–660 but overlapping the second booking 720–780 is rejected 0ms
   × AC5: the decision does not change the existing booking data > AC5: an Available request leaves the bookings equal to a copy taken before the call 0ms
     → expected false to be true // Object.is equality
   × Week 08 regressions: the provided buggy canBook > BUG-A AC4: 660–720 touching 600–660 on its left and 720–780 on its right is accepted 1ms
     → expected false to be true // Object.is equality
   × Week 08 regressions: the provided buggy canBook > BUG-B AC5: 720–780 touches nothing, is accepted, and leaves the bookings unchanged 4ms
     → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

⎯⎯⎯⎯⎯⎯ Failed Tests 11 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > AC1: valid interval inside the day, start after the supplied now > R01 AC1: 541–571 starts one minute after now is accepted (pair of the starts-now case)
TypeError: Cannot add property 1, object is not extensible
 ❯ Module.canBook src/booking.ts:36:12
     34|   }
     35|   // keep the room's list current with the slot that was just found fr…
     36|   bookings.push({ start, end });
       |            ^
     37|   return true;
     38| }
 ❯ decide src/booking.test.ts:43:20
 ❯ src/booking.test.ts:54:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/11]⎯

 FAIL  src/booking.test.ts > AC1: valid interval inside the day, start after the supplied now > R02 AC1: 1380–1440 ending exactly at 24:00 is accepted (pair of the past-day-end case)
TypeError: Cannot add property 1, object is not extensible
 ❯ Module.canBook src/booking.ts:36:12
     34|   }
     35|   // keep the room's list current with the slot that was just found fr…
     36|   bookings.push({ start, end });
       |            ^
     37|   return true;
     38| }
 ❯ decide src/booking.test.ts:43:20
 ❯ src/booking.test.ts:70:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/11]⎯

 FAIL  src/booking.test.ts > AC1: valid interval inside the day, start after the supplied now > X1 AC1 AC2: 1320–1440 ends at 24:00 and lasts exactly 120 minutes, accepted
TypeError: Cannot add property 1, object is not extensible
 ❯ Module.canBook src/booking.ts:36:12
     34|   }
     35|   // keep the room's list current with the slot that was just found fr…
     36|   bookings.push({ start, end });
       |            ^
     37|   return true;
     38| }
 ❯ decide src/booking.test.ts:43:20
 ❯ src/booking.test.ts:74:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/11]⎯

 FAIL  src/booking.test.ts > AC1: valid interval inside the day, start after the supplied now > R05 AC1: 660–720 with now = 659 is accepted (the supplied now is used)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:78:57
     76| 
     77|   test('R05 AC1: 660–720 with now = 659 is accepted (the supplied now …
     78|     expect(decide(makeRequest(660, 720, { now: 659 }))).toBe(true);
       |                                                         ^
     79|   });
     80| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/11]⎯

 FAIL  src/booking.test.ts > AC2: no longer than 120 minutes > T06 AC2: 720–840, exactly 120 minutes, is accepted
TypeError: Cannot add property 1, object is not extensible
 ❯ Module.canBook src/booking.ts:36:12
     34|   }
     35|   // keep the room's list current with the slot that was just found fr…
     36|   bookings.push({ start, end });
       |            ^
     37|   return true;
     38| }
 ❯ decide src/booking.test.ts:43:20
 ❯ src/booking.test.ts:88:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/11]⎯

 FAIL  src/booking.test.ts > AC4: no overlap, touching endpoints allowed > T01 AC4: 660–720 touching the end of 600–660 is accepted
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:104:43
    102| describe('AC4: no overlap, touching endpoints allowed', () => {
    103|   test('T01 AC4: 660–720 touching the end of 600–660 is accepted', () …
    104|     expect(decide(makeRequest(660, 720))).toBe(true);
       |                                           ^
    105|   });
    106| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/11]⎯

 FAIL  src/booking.test.ts > AC4: no overlap, touching endpoints allowed > T08 AC4: 570–600 touching the start of 600–660 is accepted
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:108:43
    106| 
    107|   test('T08 AC4: 570–600 touching the start of 600–660 is accepted', (…
    108|     expect(decide(makeRequest(570, 600))).toBe(true);
       |                                           ^
    109|   });
    110| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/11]⎯

 FAIL  src/booking.test.ts > AC4: no overlap, touching endpoints allowed > T14 AC4: 630–690 with no bookings is accepted
TypeError: Cannot add property 0, object is not extensible
 ❯ Module.canBook src/booking.ts:36:12
     34|   }
     35|   // keep the room's list current with the slot that was just found fr…
     36|   bookings.push({ start, end });
       |            ^
     37|   return true;
     38| }
 ❯ decide src/booking.test.ts:43:20
 ❯ src/booking.test.ts:136:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/11]⎯

 FAIL  src/booking.test.ts > AC5: the decision does not change the existing booking data > AC5: an Available request leaves the bookings equal to a copy taken before the call
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:158:22
    156|     const decision = canBook(deepFreeze(request));
    157| 
    158|     expect(decision).toBe(true); // the success path, where a booking …
       |                      ^
    159|     expect(request.bookings).toBe(sameArray);
    160|     expect(JSON.stringify(request.bookings)).toBe(before);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/11]⎯

 FAIL  src/booking.test.ts > Week 08 regressions: the provided buggy canBook > BUG-A AC4: 660–720 touching 600–660 on its left and 720–780 on its right is accepted
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:175:30
    173|       ],
    174|     });
    175|     expect(canBook(request)).toBe(true);
       |                              ^
    176|   });
    177| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/11]⎯

 FAIL  src/booking.test.ts > Week 08 regressions: the provided buggy canBook > BUG-B AC5: 720–780 touches nothing, is accepted, and leaves the bookings unchanged
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:185:30
    183| 
    184|     expect(decision).toBe(true);
    185|     expect(request.bookings).toEqual(before);
       |                              ^
    186|   });
    187| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/11]⎯


 Test Files  1 failed (1)
      Tests  11 failed | 14 passed (25)
   Start at  23:04:57
   Duration  359ms (transform 63ms, setup 0ms, collect 50ms, tests 24ms, environment 0ms, prepare 79ms)
```

---

## 3. Defect log

One row per defect. At least **BUG-A and BUG-B**. "Suspected cause" is your hypothesis
**before** you ask any assistant: the line and why.

| Defect | Test ID | Input | Expected | Actual | Suspected cause (line and why) |
| --- | --- | --- | --- | --- | --- |
| BUG-A | T01, T08 (and my `BUG-A` test) | 660–720 with bookings [600–660] (T01); 570–600 with [600–660] (T08) | `true` (AC4: touching is allowed) | `false` | The overlap line `if (start <= b.end && end >= b.start)`: with `<=` / `>=` a shared endpoint (660 = 660) counts as a conflict, so intervals are treated as closed `[start, end]` instead of half-open. R03/R04/T09–T12 still pass, so only the boundary is wrong. |
| BUG-B | AC5, R01, R02, X1, R05, T06, T14 (and my `BUG-B` test) | 541–571, 1380–1440, 720–840, 630–690 with no bookings … any request that should be Available | `true`, bookings unchanged | `TypeError: Cannot add property 1, object is not extensible` (my Week 07 `decide()` freezes the request) | `bookings.push({ start, end });` just before `return true`: every Available decision writes into the caller's array. Every *rejected* case passed, every *accepted* case crashed, which points at the success path. The AC5 test fails with `expected false to be true` instead: its request 660–720 touches 600–660, so BUG-A rejects it before the push. It fails for the wrong reason. |

---

## 4. Tasks 2–3 — the skill

**The checks from the deck, before you zip it.** Answer each one yes / no:

| Check | yes / no |
| --- | --- |
| The file is plain UTF-8 text, named exactly `SKILL.md` (not `SKILL.md.txt`) | yes |
| The first and the closing YAML delimiter are exactly three hyphens: `---` | yes |
| `name` is lowercase with hyphens, and `description` says WHEN to use it | yes |
| I read the whole file once: no passwords, API keys or private student data | yes |

**The contents of `skills/bug-detector.zip`.** Paste the listing (Windows: open the ZIP and copy
the paths; macOS/Linux: `unzip -l skills/bug-detector.zip`):

```text
Archive:  bug-detector.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
      570  2026-11-08 23:05   bug-detector/SKILL.md
---------                     -------
      570                     1 file
```

**Installation.** Where you uploaded it, what the upload said, and whether a new chat showed the
skill as enabled. If upload was not available, write `prompt-only simulation` and say why.
Screenshot of the result: `evidence/install.png`.

<!-- Write below this line -->

prompt-only simulation. The skill was not uploaded: the work was done from a Claude Code agent session, which has no Skills upload screen, and there was no time before the deadline to try a Claude web upload. Following the deck's fallback, a fresh assistant session received the full text of `SKILL.md` as its first message, labelled "prompt-only simulation, not an installed skill", and then the skill question with the same input as section 5. The evidence is `evidence/install.png`, a rendering of that simulated chat (not a screenshot of a Skills page). The ZIP was still built and checked: it holds `bug-detector/SKILL.md` and nothing else.

---

## 5. Task 4 — without the skill

A **fresh chat, with no skill enabled**. Paste exactly what you sent: the deck's question, then
the same input you will use in section 6 (AC1–AC6, the failing test output, the code of
`canBook`):

```text
Find the root cause of the failed room-booking test. Propose minimal patch and regression test. Do not edit code.

Acceptance criteria (Smart Campus room availability, one room, fixed time, Boolean decision):
AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.

Failing test output (Vitest 3.2.7):
 FAIL  src/booking.test.ts > AC4: no overlap, touching endpoints allowed > T01 AC4: 660–720 touching the end of 600–660 is accepted
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:104:43
    102| describe('AC4: no overlap, touching endpoints allowed', () => {
    103|   test('T01 AC4: 660–720 touching the end of 600–660 is accepted', () …
    104|     expect(decide(makeRequest(660, 720))).toBe(true);
       |                                           ^
    105|   });
    106| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/9]⎯

Code of canBook as provided:
export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
```

**The assistant's answer, pasted unedited:**

```text
## Root cause

The overlap check in the loop counts touching endpoints as a conflict:

~~~ts
if (start <= b.end && end >= b.start) return false;
~~~

For the failing case (existing booking 600–660, request 660–720):

- `660 <= 660` is true
- `720 >= 600` is true

So the request is rejected. That breaks AC4, which says bookings that only touch at endpoints must be allowed. Booking intervals are half-open `[start, end)`, so two of them overlap only when `start < b.end && end > b.start`. Both comparisons need to be strict.

## Second defect (AC5)

~~~ts
bookings.push({ start, end });
~~~

A function that only checks availability must not change booking data, so this breaks AC5. It also has a side effect: if the tests share a `bookings` fixture, each accepted request leaves a "ghost" booking behind. Later tests can then fail or pass depending on what ran before them. The output shows this was failure 6 of 9 (`[6/9]`), so some of the other failures may come from this. I can't confirm that without seeing `makeRequest` and `decide`.

## Proposed minimal patch

~~~diff
   for (const b of bookings) {
-    if (start <= b.end && end >= b.start) return false;
+    if (start < b.end && end > b.start) return false;
   }
-  // keep the room's list current with the slot that was just found free
-  bookings.push({ start, end });
   return true;
 }
~~~

If this was meant to stay strictly a one-line fix, the change on the comparison line alone fixes T01. Removing the `push` is still needed to meet AC5. If the app really does need to save a booking, that should happen in a separate `book()` function that calls `canBook` first.

The parameter type could also become `readonly { start: number; end: number }[]`. The compiler would then reject any future mutation.

## Regression tests

These assume the same fixture as T01: one existing booking 600–660, `now` earlier than these times, room not blocked.

~~~ts
describe('AC4 regression: endpoint boundaries', () => {
  test('R01 touching the start (540–600) is accepted', () => {
    expect(decide(makeRequest(540, 600))).toBe(true);
  });
  test('R02 touching the end (660–720) is accepted', () => {
    expect(decide(makeRequest(660, 720))).toBe(true);
  });
  test('R03 one-minute overlap at the end (659–720) is rejected', () => {
    expect(decide(makeRequest(659, 720))).toBe(false);
  });
  test('R04 one-minute overlap at the start (540–601) is rejected', () => {
    expect(decide(makeRequest(540, 601))).toBe(false);
  });
  test('R05 identical slot (600–660) is rejected', () => {
    expect(decide(makeRequest(600, 660))).toBe(false);
  });
  test('R06 contained slot (610–620) is rejected', () => {
    expect(decide(makeRequest(610, 620))).toBe(false);
  });
});

describe('AC5 regression: no mutation', () => {
  test('R07 canBook leaves bookings unchanged', () => {
    const bookings = [{ start: 600, end: 660 }];
    const snapshot = structuredClone(bookings);
    canBook({ start: 660, end: 720, now: 0, blocked: false, bookings });
    expect(bookings).toEqual(snapshot);
  });
  test('R08 repeated identical call gives the same answer', () => {
    const bookings = [{ start: 600, end: 660 }];
    const req = { start: 660, end: 720, now: 0, blocked: false, bookings };
    expect(canBook(req)).toBe(true);
    expect(canBook(req)).toBe(true); // the original code returns false here
  });
  test('R09 frozen input does not throw', () => {
    const bookings = Object.freeze([{ start: 600, end: 660 }]) as any;
    expect(() =>
      canBook({ start: 660, end: 720, now: 0, blocked: false, bookings })
    ).not.toThrow();
  });
});
~~~

Run against the original code:

- R02 fails because of the `<=`/`>=` comparison.
- R01 fails for the same reason.
- R07, R08 and R09 fail because of the `push`.

All of them pass with the patch.

## Notes

- **AC1:** `start > now` rejects a request that starts exactly at `now`. Check whether "in the past" should allow `start == now`. Don't change it without confirming.
- **AC2:** `end - start > 120` correctly allows exactly 120 minutes. Adding a boundary test for 120 (accepted) and 121 (rejected) would help.
- **AC6:** UI feedback is outside `canBook`, and the patch doesn't affect it.
```

---

## 6. Task 5 — with the skill

**Another fresh chat, with `bug-detector` enabled.** Send exactly the same input as in section 5.
Only the question changes, to the deck's skill question:

```text
[First message of this chat: the full text of skills/bug-detector/SKILL.md, introduced as "This is a prompt-only simulation, not an installed skill." The assistant acknowledged it. Then:]

Use the bug-detector skill to diagnose the failed room-booking test.

Acceptance criteria (Smart Campus room availability, one room, fixed time, Boolean decision):
AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.

Failing test output (Vitest 3.2.7):
 FAIL  src/booking.test.ts > AC4: no overlap, touching endpoints allowed > T01 AC4: 660–720 touching the end of 600–660 is accepted
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:104:43
    102| describe('AC4: no overlap, touching endpoints allowed', () => {
    103|   test('T01 AC4: 660–720 touching the end of 600–660 is accepted', () …
    104|     expect(decide(makeRequest(660, 720))).toBe(true);
       |                                           ^
    105|   });
    106| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/9]⎯

Code of canBook as provided:
export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
```

**The assistant's answer, pasted unedited:**

```text
# Bug Detector report: T01 (AC4, touching endpoints)

## Assumptions about code I haven't seen

The test calls `decide(makeRequest(660, 720))`, but you didn't include `decide` or `makeRequest`. I'm assuming:

- `decide` passes the request straight to `canBook`.
- The fixture has one existing booking, 600–660.
- `now` is before 660.
- `blocked` is false.

If any of these is wrong, please send those two helpers.

## Smallest reproducing input

~~~ts
canBook({ start: 660, end: 720, now: 0, blocked: false, bookings: [{ start: 600, end: 660 }] })
// expected true (AC4), actual false
~~~

Walking through the checks:

- **Range check** `0 ≤ 660 < 720 ≤ 1440`: passes.
- **Past check** `660 > 0`: passes.
- **Duration check** `60 ≤ 120`: passes.
- **Blocked check**: not blocked, passes.
- **Overlap check** `660 <= 660 && 720 >= 600`: this is **true**, so the function returns `false`. This line is where the test fails.

## Findings

| # | Status | Defect | Evidence | Root cause | Minimal fix (not applied) | Regression test → expected |
|---|---|---|---|---|---|---|
| D1 | **Confirmed** | AC4: a booking that only touches an existing one at an endpoint is rejected | T01 fails at `booking.test.ts:104` (expected `true`, got `false`). The walkthrough above reproduces it. | The overlap check uses `<=` and `>=`, so it treats bookings as closed intervals `[start, end]`. AC4 needs half-open intervals `[start, end)`, where a shared endpoint is not an overlap. | Change it to `if (start < b.end && end > b.start) return false;` | See T01–T04 below |
| D2 | **Confirmed** (by reading the code) | AC5: checking availability changes the booking data | `bookings.push({ start, end });` runs before `return true`. The comment says it does this on purpose. | The function both answers the question and records a booking. AC5 says it should only answer. | Delete the `push` and its comment. Recording a booking belongs in a separate function. | See T05–T06 below |
| H1 | Hypothesis | Tests depend on run order, which may explain some of the other failures (the output shows `[6/9]`) | Not observed directly. Only one failure is shown. | If `makeRequest` reuses one `bookings` array across tests, D2 adds every accepted slot to it, so later tests see extra bookings. | Fixing D2 removes this. Also have `makeRequest` build a new array on each call. | Run the suite in random order (`vitest --sequence.shuffle`); results should not change |
| H2 | Hypothesis (unclear spec) | AC1 doesn't say what happens when `start == now` | The code rejects it (`start > now`). AC1 only says "in the past." | The requirement is ambiguous, not necessarily a bug. | No change for now. Ask whether a booking starting right now should be accepted. | Add a test for `start == now` once the rule is agreed |

D1 alone explains the T01 failure. D2 is a separate defect: T01 can't detect it because it only looks at the return value.

## Regression tests

The existing booking is 600–660 and `now` is 0 unless noted.

- **T01** 660–720 (touches the end): `true`
- **T02** 540–600 (touches the start): `true`
- **T03** 659–720 (overlaps by 1 minute): `false`
- **T04** 600–660 (same slot): `false`
- **T05** Call with 660–720, then check that `bookings` still deep-equals `[{start:600,end:660}]`
- **T06** Call with 660–720 twice: both return `true`. Today the second call returns `false`, because the first call stored the slot.

AC6 (clear UI feedback on desktop and mobile) has nothing to do with `canBook`. You'd need to check it separately in a UI or end-to-end test.
```

Did the environment show that the skill was invoked? not shown (prompt-only simulation: there is no skill badge; the answer follows the 7-step output format, which is the only sign).

Note: inside both pasted answers the assistant's own ``` code fences were changed to ~~~ so they do not close this worksheet's block. Nothing else was changed.

---

## 7. Comparison — judged against the actual code

Do not assume the skill did better. Judge both answers against the code and against what your
tests showed. Write a short verdict in each cell, and give a reason where they differ.

| Criterion | No skill | With skill |
| --- | --- | --- |
| Correct root cause | Correct for BUG-A: names the `<=`/`>=` line and walks 660 <= 660. Also finds BUG-B (`bookings.push`) from the code alone, although T01 cannot show it. | Correct for BUG-A, with a step-by-step walk through every check down to the overlap line. Also finds BUG-B as D2, marked "Confirmed (by reading the code)". |
| Reproducible test | Gives runnable tests, but R01/R02… clash with my real IDs, and R09 (frozen bookings must not throw) is the only one that matches how my suite actually saw BUG-B. | Gives the smallest direct `canBook` call for T01 (good), but its tests are one-line bullets, not code, and reuse T01–T06, which already exist with other meanings. |
| Minimal proposed patch | Two-line diff plus deleting the comment, all in one hunk. The comparison change alone fixes BUG-A; it says so. Not one change per bug. | Same two fixes, but stated separately per defect (D1, D2), which maps onto my two commits. Also suggests deleting the comment. |
| Unsupported claims | R08: "the original code returns false here" on the second call. Wrong: on the buggy code the first call already returns false (BUG-A), so nothing is pushed. Also guesses a shared fixture caused the other failures; my fixtures are fresh per test. | T06: "Today the second call returns false, because the first call stored the slot". Wrong for the same reason: BUG-A rejects 660–720 first. H1 (shared fixture) is false for my suite, but it is labelled a hypothesis, not a fact. |
| Clarity of explanation | Clear prose, but defects, guesses and notes are mixed in one flow. | Clearer: one table, status column, assumptions listed first and asks for `decide`/`makeRequest`. Longer to read. |

**Which bugs did each answer find?** (BUG-A, BUG-B, both, neither)

- No skill: both. BUG-A from the T01 failure, BUG-B only by reading the code.
- With skill: both. BUG-A confirmed from T01, BUG-B as D2 "confirmed by reading the code".
- Neither noticed that BUG-A hides BUG-B for touching requests: both predicted that a repeated 660–720 call fails because of the push. On the buggy code it never reaches the push. My AC5 test showed this (expected false to be true, not a TypeError).

---

## 8. Task 6 — repair and regression

Review the proposed patch yourself, then make **one minimal change per bug**, one commit each.
Rerun the test that was failing, then the full suite.

### 8.1 The BUG-A patch

The change as a diff (`git diff`, or the old and the new line), then the real run:

```text
diff --git a/week-08/app/src/booking.ts b/week-08/app/src/booking.ts
index 3efef23..6416365 100644
--- a/week-08/app/src/booking.ts
+++ b/week-08/app/src/booking.ts
@@ -30,7 +30,7 @@ export function canBook({ start, end, now, blocked, bookings }: {
   if (end - start > 120) return false;
   if (blocked) return false;
   for (const b of bookings) {
-    if (start <= b.end && end >= b.start) return false;
+    if (start < b.end && end > b.start) return false;
   }
   // keep the room's list current with the slot that was just found free
   bookings.push({ start, end });

$ npx vitest run -t "BUG-A"

 RUN  v3.2.7 /home/claude/repo/week-08/app

 ✓ src/booking.test.ts (25 tests | 24 skipped) 3ms

 Test Files  1 passed (1)
      Tests  1 passed | 24 skipped (25)
   Start at  23:05:55
   Duration  430ms (transform 56ms, setup 0ms, collect 56ms, tests 3ms, environment 0ms, prepare 85ms)

$ npx vitest run   (full suite after the BUG-A patch)

 RUN  v3.2.7 /home/claude/repo/week-08/app

 ❯ src/booking.test.ts (25 tests | 10 failed) 19ms
   ✓ AC1: valid interval inside the day, start after the supplied now > T02 AC1: 540–570 starts exactly at now (540) is rejected 2ms
   × AC1: valid interval inside the day, start after the supplied now > R01 AC1: 541–571 starts one minute after now is accepted (pair of the starts-now case) 5ms
     → Cannot add property 1, object is not extensible
   ✓ AC1: valid interval inside the day, start after the supplied now > T03 AC1: 720–720 zero duration is rejected 0ms
   ✓ AC1: valid interval inside the day, start after the supplied now > T04 AC1: 750–720 reversed interval is rejected 0ms
   ✓ AC1: valid interval inside the day, start after the supplied now > T05 AC1: 1380–1441 past the end of the day is rejected 0ms
   × AC1: valid interval inside the day, start after the supplied now > R02 AC1: 1380–1440 ending exactly at 24:00 is accepted (pair of the past-day-end case) 0ms
     → Cannot add property 1, object is not extensible
   × AC1: valid interval inside the day, start after the supplied now > X1 AC1 AC2: 1320–1440 ends at 24:00 and lasts exactly 120 minutes, accepted 0ms
     → Cannot add property 1, object is not extensible
   × AC1: valid interval inside the day, start after the supplied now > R05 AC1: 660–720 with now = 659 is accepted (the supplied now is used) 0ms
     → Cannot add property 1, object is not extensible
   ✓ AC1: valid interval inside the day, start after the supplied now > R06 AC1: 660–720 with now = 660 is rejected (start equals the supplied now) 0ms
   × AC2: no longer than 120 minutes > T06 AC2: 720–840, exactly 120 minutes, is accepted 0ms
     → Cannot add property 1, object is not extensible
   ✓ AC2: no longer than 120 minutes > T07 AC2: 720–841, 121 minutes, is rejected 0ms
   ✓ AC3: blocked room > T13 AC3: 660–720 in a blocked room is rejected 0ms
   × AC4: no overlap, touching endpoints allowed > T01 AC4: 660–720 touching the end of 600–660 is accepted 0ms
     → Cannot add property 1, object is not extensible
   × AC4: no overlap, touching endpoints allowed > T08 AC4: 570–600 touching the start of 600–660 is accepted 0ms
     → Cannot add property 1, object is not extensible
   ✓ AC4: no overlap, touching endpoints allowed > R03 AC4: 659–720 overlapping the booking by one minute at its end is rejected 0ms
   ✓ AC4: no overlap, touching endpoints allowed > R04 AC4: 541–601 overlapping the booking by one minute at its start is rejected 0ms
   ✓ AC4: no overlap, touching endpoints allowed > T09 AC4: 630–690 partial overlap is rejected 0ms
   ✓ AC4: no overlap, touching endpoints allowed > T10 AC4: 570–690 containing the whole booking is rejected 0ms
   ✓ AC4: no overlap, touching endpoints allowed > T11 AC4: 615–645 inside the booking is rejected 0ms
   ✓ AC4: no overlap, touching endpoints allowed > T12 AC4: 600–660 identical to the booking is rejected 0ms
   × AC4: no overlap, touching endpoints allowed > T14 AC4: 630–690 with no bookings is accepted 0ms
     → Cannot add property 0, object is not extensible
   ✓ AC4: no overlap, touching endpoints allowed > X2 AC4: 750–800 clear of 600–660 but overlapping the second booking 720–780 is rejected 0ms
   × AC5: the decision does not change the existing booking data > AC5: an Available request leaves the bookings equal to a copy taken before the call 2ms
     → Cannot add property 1, object is not extensible
   ✓ Week 08 regressions: the provided buggy canBook > BUG-A AC4: 660–720 touching 600–660 on its left and 720–780 on its right is accepted 0ms
   × Week 08 regressions: the provided buggy canBook > BUG-B AC5: 720–780 touches nothing, is accepted, and leaves the bookings unchanged 4ms
     → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

⎯⎯⎯⎯⎯⎯ Failed Tests 10 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > AC1: valid interval inside the day, start after the supplied now > R01 AC1: 541–571 starts one minute after now is accepted (pair of the starts-now case)
TypeError: Cannot add property 1, object is not extensible
 ❯ Module.canBook src/booking.ts:36:12
     34|   }
     35|   // keep the room's list current with the slot that was just found fr…
     36|   bookings.push({ start, end });
       |            ^
     37|   return true;
     38| }
 ❯ decide src/booking.test.ts:43:20
 ❯ src/booking.test.ts:54:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/10]⎯

 FAIL  src/booking.test.ts > AC1: valid interval inside the day, start after the supplied now > R02 AC1: 1380–1440 ending exactly at 24:00 is accepted (pair of the past-day-end case)
TypeError: Cannot add property 1, object is not extensible
 ❯ Module.canBook src/booking.ts:36:12
     34|   }
     35|   // keep the room's list current with the slot that was just found fr…
     36|   bookings.push({ start, end });
       |            ^
     37|   return true;
     38| }
 ❯ decide src/booking.test.ts:43:20
 ❯ src/booking.test.ts:70:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/10]⎯

 FAIL  src/booking.test.ts > AC1: valid interval inside the day, start after the supplied now > X1 AC1 AC2: 1320–1440 ends at 24:00 and lasts exactly 120 minutes, accepted
TypeError: Cannot add property 1, object is not extensible
 ❯ Module.canBook src/booking.ts:36:12
     34|   }
     35|   // keep the room's list current with the slot that was just found fr…
     36|   bookings.push({ start, end });
       |            ^
     37|   return true;
     38| }
 ❯ decide src/booking.test.ts:43:20
 ❯ src/booking.test.ts:74:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/10]⎯

 FAIL  src/booking.test.ts > AC1: valid interval inside the day, start after the supplied now > R05 AC1: 660–720 with now = 659 is accepted (the supplied now is used)
TypeError: Cannot add property 1, object is not extensible
 ❯ Module.canBook src/booking.ts:36:12
     34|   }
     35|   // keep the room's list current with the slot that was just found fr…
     36|   bookings.push({ start, end });
       |            ^
     37|   return true;
     38| }
 ❯ decide src/booking.test.ts:43:20
 ❯ src/booking.test.ts:78:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/10]⎯

 FAIL  src/booking.test.ts > AC2: no longer than 120 minutes > T06 AC2: 720–840, exactly 120 minutes, is accepted
TypeError: Cannot add property 1, object is not extensible
 ❯ Module.canBook src/booking.ts:36:12
     34|   }
     35|   // keep the room's list current with the slot that was just found fr…
     36|   bookings.push({ start, end });
       |            ^
     37|   return true;
     38| }
 ❯ decide src/booking.test.ts:43:20
 ❯ src/booking.test.ts:88:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/10]⎯

 FAIL  src/booking.test.ts > AC4: no overlap, touching endpoints allowed > T01 AC4: 660–720 touching the end of 600–660 is accepted
TypeError: Cannot add property 1, object is not extensible
 ❯ Module.canBook src/booking.ts:36:12
     34|   }
     35|   // keep the room's list current with the slot that was just found fr…
     36|   bookings.push({ start, end });
       |            ^
     37|   return true;
     38| }
 ❯ decide src/booking.test.ts:43:20
 ❯ src/booking.test.ts:104:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/10]⎯

 FAIL  src/booking.test.ts > AC4: no overlap, touching endpoints allowed > T08 AC4: 570–600 touching the start of 600–660 is accepted
TypeError: Cannot add property 1, object is not extensible
 ❯ Module.canBook src/booking.ts:36:12
     34|   }
     35|   // keep the room's list current with the slot that was just found fr…
     36|   bookings.push({ start, end });
       |            ^
     37|   return true;
     38| }
 ❯ decide src/booking.test.ts:43:20
 ❯ src/booking.test.ts:108:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/10]⎯

 FAIL  src/booking.test.ts > AC4: no overlap, touching endpoints allowed > T14 AC4: 630–690 with no bookings is accepted
TypeError: Cannot add property 0, object is not extensible
 ❯ Module.canBook src/booking.ts:36:12
     34|   }
     35|   // keep the room's list current with the slot that was just found fr…
     36|   bookings.push({ start, end });
       |            ^
     37|   return true;
     38| }
 ❯ decide src/booking.test.ts:43:20
 ❯ src/booking.test.ts:136:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/10]⎯

 FAIL  src/booking.test.ts > AC5: the decision does not change the existing booking data > AC5: an Available request leaves the bookings equal to a copy taken before the call
TypeError: Cannot add property 1, object is not extensible
 ❯ Module.canBook src/booking.ts:36:12
     34|   }
     35|   // keep the room's list current with the slot that was just found fr…
     36|   bookings.push({ start, end });
       |            ^
     37|   return true;
     38| }
 ❯ src/booking.test.ts:156:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/10]⎯

 FAIL  src/booking.test.ts > Week 08 regressions: the provided buggy canBook > BUG-B AC5: 720–780 touches nothing, is accepted, and leaves the bookings unchanged
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:185:30
    183| 
    184|     expect(decision).toBe(true);
    185|     expect(request.bookings).toEqual(before);
       |                              ^
    186|   });
    187| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/10]⎯


 Test Files  1 failed (1)
      Tests  10 failed | 15 passed (25)
   Start at  23:05:56
   Duration  342ms (transform 42ms, setup 0ms, collect 41ms, tests 19ms, environment 0ms, prepare 66ms)
```

### 8.2 The BUG-B patch and the final run

The change as a diff, then the real output of the **full** suite. Every test must pass.

```text
diff --git a/week-08/app/src/booking.ts b/week-08/app/src/booking.ts
index 6416365..3787ac7 100644
--- a/week-08/app/src/booking.ts
+++ b/week-08/app/src/booking.ts
@@ -33,6 +33,5 @@ export function canBook({ start, end, now, blocked, bookings }: {
     if (start < b.end && end > b.start) return false;
   }
   // keep the room's list current with the slot that was just found free
-  bookings.push({ start, end });
   return true;
 }

$ npx vitest run -t "BUG-B"

 RUN  v3.2.7 /home/claude/repo/week-08/app

 ✓ src/booking.test.ts (25 tests | 24 skipped) 3ms

 Test Files  1 passed (1)
      Tests  1 passed | 24 skipped (25)
   Start at  23:06:06
   Duration  403ms (transform 52ms, setup 0ms, collect 51ms, tests 3ms, environment 0ms, prepare 74ms)

$ npx vitest run   (full suite, final)

 RUN  v3.2.7 /home/claude/repo/week-08/app

 ✓ src/booking.test.ts (25 tests) 7ms

 Test Files  1 passed (1)
      Tests  25 passed (25)
   Start at  23:06:07
   Duration  367ms (transform 46ms, setup 0ms, collect 48ms, tests 7ms, environment 0ms, prepare 95ms)
```

---

## 9. What still fails, and what AI-assisted debugging cannot do

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | The last checker run is clean (31 PASS). `node_modules/` was moved out of `app/` before it, as B6 requires. |

### 9.2 One limitation of AI-assisted debugging

<!-- Use something that actually happened in sections 5-8. 20 words or more. -->
- The assistant only sees the input it is given, and both answers filled the gap with confident guesses. Both predicted that calling 660–720 twice returns false the second time because of the push. On the buggy code BUG-A rejects the first call, so the push never runs. My AC5 test showed this: it failed with `expected false to be true`, not with the TypeError. After the BUG-A patch, T01, T08 and AC5 turned into TypeErrors from BUG-B (section 8.1). Neither answer predicted that one bug hides the other; only running the tests showed it.

---

## 10. Conclusion (80–150 words)

<!-- Answer both, in your own words, without the assistant (3-5 sentences, as the deck asks):
     (a) Did the skill help? Show it with one row of section 7.
     (b) What did your tests actually prove - and what did they not?
     Worthless: "The skill made the AI much better at debugging."
     Worth everything: "Both answers found BUG-A from the T01 failure. Only the skill answer
     separated BUG-B as a hypothesis instead of a fact, because step 4 told it to. BUG-B was only
     visible after the BUG-A patch: the AC5 test had been failing for the wrong reason." -->

<!-- Write your conclusion below this line -->

The skill helped with structure more than with correctness. Both answers found the same two defects with the same fixes. In the "Unsupported claims" row the skill answer at least labelled its shared-fixture guess as hypothesis H1, while the plain answer stated a similar guess inside its prose. Both still made the same wrong claim about a second 660–720 call, so step 4 did not stop an unchecked prediction. My tests proved more than either answer did. T01, T08 and BUG-A failed on the overlap line. BUG-B failed on the push. AC5 failed for the wrong reason until BUG-A was fixed. After two one-line patches all 25 tests pass. They do not prove AC6 or the UI, and they say nothing about `start == now` beyond what AC1 already defines.
