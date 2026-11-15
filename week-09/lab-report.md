# Week 09 — Lab Report: canBook as a Tool

Fill in every section. Do not delete or renumber the headings: the README and the checker point at
them. Replace every `<!-- comment -->` with your own text (comments are ignored by the checker).

**Name:** Ayan Zeinetula
**Student ID:** 24B031804
**GitHub:** zeinetula

---

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | Claude (Anthropic), run through Claude Code |
| Exact model (or "not displayed") | Claude Sonnet, subagent model alias "sonnet"; exact version not displayed |
| Three fresh chats for R1, R2, R3? (yes / no) | yes: three separate fresh sessions, one request each, no shared context |
| Python version (`python --version`) | Python 3.13.1 |

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```json
{
  "name": "check_room",
  "description": "Checks whether a room can be booked for a requested time slot. It only checks: it does not save, create or change any booking. All times are whole minutes since midnight, from 0 (00:00) to 1440 (24:00), so 10:00 is 600 and 15:15 is 915. Returns Available or Unavailable according to the booking rules (slot inside the day and after the current time, at most 120 minutes, room not blocked, no overlap with existing bookings; touching bookings are allowed).",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested start of the booking, in whole minutes since midnight (10:00 = 600)."
      },
      "end": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested end of the booking, in whole minutes since midnight (24:00 = 1440)."
      },
      "now": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "The current time, in whole minutes since midnight (08:00 = 480)."
      },
      "blocked": {
        "type": "boolean",
        "description": "true if the room is blocked (for example for maintenance), false otherwise."
      },
      "bookings": {
        "type": "array",
        "description": "Existing bookings of the room. May be empty.",
        "items": {
          "type": "object",
          "properties": {
            "start": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440,
              "description": "Start of the existing booking, in minutes since midnight."
            },
            "end": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440,
              "description": "End of the existing booking, in minutes since midnight."
            }
          },
          "required": ["start", "end"],
          "additionalProperties": false
        }
      }
    },
    "required": ["start", "end", "now", "blocked", "bookings"],
    "additionalProperties": false
  }
}
```

| Field | Constraint (e.g. `"type": "integer"`, `"maximum": 1440`) | What goes wrong without it |
| --- | --- | --- |
| root | `"additionalProperties": false` | A model can invent a field such as `"room": "204"`; the call looks fine but means nothing to `canBook` (S05). |
| root | `"required"` lists all five fields | A call without `now` is accepted, and `canBook` cannot judge AC1 "start after now" (S04). |
| start, end, now | `"type": "integer"` | `"11:00"` or `600.5` is accepted, but `canBook` works on whole minutes (S03, S10). |
| start, end, now | `"minimum": 0`, `"maximum": 1440` | `-30` or `1500` pass, but they are outside the day (AC1) (S06, S07); 1440 must stay allowed as 24:00 (S11). |
| blocked | `"type": "boolean"` | The string `"false"` is accepted, and in many languages a non-empty string counts as true, so a free room would look blocked (S09). |
| bookings | `"type": "array"` with `items` of type object | `[[660, 720]]` is accepted, but `canBook` reads `.start` and `.end` of each booking (S12). |
| bookings items | `"required": ["start", "end"]`, `"additionalProperties": false`, integer 0-1440 | A booking with only `start` (S08) passes, so the overlap check (AC4) would compare against `undefined`. |
| bookings | no `minItems` | An empty list must stay valid: a room with no bookings (S02). |
| description | minutes, 0-1440, "does not save" | A model that has never seen the course might send `"10:00"`, or might think the tool creates the booking (AC5). |

## 3. The twelve calls — first run and final run

Your **first** run's S verdicts (before any fix), and your final ones. For every case that changed,
say what you changed.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | | | |
| S02 | | | |
| S03 | | | |
| S04 | | | |
| S05 | | | |
| S06 | | | |
| S07 | | | |
| S08 | | | |
| S09 | | | |
| S10 | | | |
| S11 | | | |
| S12 | | | |

The first run was made on the empty template: D1, D6, S01, S02 and S11 passed only because an empty schema accepts everything, and S03-S10 and S12 (9 cases) FAILED because nothing refused them. Each constraint above was added to make exactly one of these refuse.

## 4. Function calling — what the model wrote

For each request, paste the model's reply exactly, then judge it against the request.

### R1

```text
{"name": "check_room", "arguments": {"start": 600, "end": 660, "now": 540, "blocked": false, "bookings": [{"start": 660, "end": 720}]}}
```

Match. F1-F3 PASS: `start` 600, `end` 660, `now` 540, `blocked` false and one booking 660-720, all as the request says. The booking touches the requested slot, and AC4 allows touching, so `canBook` should answer Available. The model wrote a valid call and the schema accepted it.

### R2

```text
{"name": "check_room", "arguments": {"start": 840, "end": 990, "now": 810, "blocked": true, "bookings": []}}
```

Match. F4-F6 PASS: `start` 840 (14:00), `end` 990 (16:30), `now` 810 (13:30), `blocked` true, `bookings` empty. The model did not refuse to call because the room is blocked; it left that decision to the function. It also converted 16:30 correctly to 990, not 960. `canBook` will answer Unavailable (AC3), but the call itself is right and the schema accepts it. The slot is 150 minutes, so AC2 would also fail, which neither the schema nor the model checks.

### R3

```text
Which time range do you want (for example 13:00 to 15:00), what is the current time, is the room blocked, and what bookings already exist for that day?
```

The request gives no date or time of day (only "tomorrow afternoon"), no exact start and end ("a couple of hours"), no current time, no `blocked` status and no bookings. The model asked one question and did not call, so it invented no values (`calls/r3.txt`). It did the right thing, but it also asked for `now`, `blocked` and `bookings`, which a user would not know; a real client would supply those itself. Also, "a couple of hours" is exactly 120 minutes only if it means two, and AC2 allows at most 120.

## 5. What the schema cannot check

A schema looks at one value at a time, so it cannot compare two fields or compute anything.

- **AC1, `start < end` and `start` after `now`:** these compare fields with each other. With the allowed keywords a schema cannot say "this number is smaller than that one", so `start` 600 and `end` 600 is a valid call.
- **AC2, at most 120 minutes:** the length is `end - start`, which needs arithmetic. The schema only knows each number is between 0 and 1440.
- **AC3, not when blocked:** the schema checks that `blocked` is a boolean, but whether `true` means refusal is a rule of `canBook`. R2 is a valid call that must be answered Unavailable.
- **AC4, no overlap:** this compares the requested slot with every booking.
- **AC5, does not change or save anything:** this is behaviour, not data. Only the description and the permissions in section 6 can express it.

What the schema CAN enforce from AC1 is the per-field range: each of `start`, `end` and `now` is a whole number from 0 to 1440 (S03, S06, S07, S10).

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | allow | The call only checks and, by AC5, saves nothing, so a wrong call costs nothing and nothing is lost. |
| A2 | read `week-08/app/src/booking.ts` | allow | Reading a source file inside the repository changes nothing and the agent needs it to understand the code. |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | ask | This changes a business rule (AC2) the course fixed at 120 minutes; one user asking for 3 hours is not authority to change it for everyone, and the tests would start failing. |
| A4 | run `npm test` in `week-08/app` | allow | The tests run locally and only read the code, so the risk is small and the result tells the agent whether its change broke something. |
| A5 | run `git reset --hard` to undo its own last three edits | ask | `git reset --hard` throws away every uncommitted change in the working tree, including my own edits that are not part of the agent's last three, so I should confirm first. |
| A6 | `git commit` its change on the `week-09` branch | allow | A commit on the `week-09` branch is local and reversible, and it creates the checkpoints I can go back to. |
| A7 | `git push` to `main` | block | Pushing to `main` publishes unreviewed work on the branch the course says to keep clean, and the PR is meant to stay open and never be merged. |
| A8 | send the contents of `.env` to an MCP server it found online | block | `.env` holds secrets such as keys and passwords, and an unknown server found online can keep them; "to configure it" is not a reason to send them. |

## 7. Checkpoint

Before letting an agent edit anything I would commit the clean state of `week-09` with `git commit -m "Week 09: checkpoint before agent"`.

SHA: `cac6167` (the commit that holds the tool definition and the saved calls, made before any agent edit)

Command to go back: `git reset --hard <SHA>`

This throws away every change made after that commit: edits to tracked files and anything staged. The commits the agent made after the checkpoint also leave the branch (they stay only in `git reflog` for a while). Untracked new files are not removed by it, only by `git clean`.

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls/r1.json: a call to check_room
PASS  F2    calls/r1.json: arguments valid against your schema
PASS  F3    calls/r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls/r2.json: a call to check_room
PASS  F5    calls/r2.json: arguments valid against your schema
PASS  F6    calls/r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
FAIL  L3    section 7 names the checkpoint commit (a SHA)
             -> no 7-40 character commit hash in section 7
FAIL  L4    section 10: a conclusion of 80-150 words
             -> 0 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 28 PASS · 2 FAIL · 0 ERROR  (of 30 checks)
Paste this whole output into lab-report.md section 8, and these three numbers into submission.yml.
```

## 9. What still fails

L3 and L4 fail in this run because section 7 has no real commit SHA yet and section 10 is not written yet. <!-- TODO Ayan: after you add both, rerun the checker, paste the new output in section 8, update submission.yml, and change this section to "None" if all 30 pass -->

## 10. Conclusion (80–150 words)

In case S09, the checker passed `blocked: "false"` as a string; the empty schema accepted it—which could mark an open room as blocked if non-empty strings evaluate as true—until `"type": "boolean"` forced rejection.
However, a schema only checks isolated field values and cannot compare fields or read system state. In R2, the schema accepts the call even though `blocked: true` triggers `Unavailable` (AC3) and the 150-minute span exceeds the 120-minute limit (AC2).
In R3, facing vague phrasing like "tomorrow afternoon," the model refused to guess arguments and asked for clarification—though asking the user for `now` and `bookings` mixes up roles, as the client holds that state, not the user.
For agent actions, case A3 requires an `ask` policy because changing the duration limit alters AC2 globally.
Ultimately, the schema checks input shape, the model converts requests into numbers, and the function enforces business rules.
