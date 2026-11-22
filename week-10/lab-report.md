# Week 10 — Lab report

**Name:** Ayan Zeinetula
**Group:** <fill in your group>
**Date:** 22 November 2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I reviewed with (tool) | Claude (claude.ai, with read-only sub-sessions for Tasks 1, 2 and 6 and one editing sub-session on a scratch copy for the Task 8 refactor prompt) |
| Exact model (with its version, or `not displayed`) | Claude Sonnet 5.5 (claude-sonnet-5-5) |
| Where the assistant read the project (Bolt.new / Claude Code / Cursor / Copilot / chat with pasted files) | A copy of week-10/app in the assistant's own Linux workspace, read through file tools (similar to Claude Code); the review sub-sessions had no edit tools |
| Starting point (`week-08` or `week-07`) | week-08 (rebuilt: the week-07 app files plus booking.ts and booking.test.ts taken from the week-08 branch bundle, BUG-A and BUG-B fixed) |
| Baseline commit — the checkpoint of Part 0 | `e2b429d` |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | Linux workspace of the assistant (Node, npx vitest run in a copy of week-10/app); not on my computer |
| Vitest version (the `RUN  v…` line of a run) | 3.2.7 |

---

## 2. Task 1 — the baseline

### 2.1 The project's commands

Run each command in `week-10/app/` before any change. **Exists:** `yes` or `no` (is there such a
script, or such a tool in `package.json`?). **Result:** `pass`, `fail`, `missing` or `not run`.

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | vitest ^3.2.7 is in devDependencies; 25 tests |
| `npm test` | yes | pass | script `test` = `vitest run` |
| `npm run test:unit` (the test command in `AGENTS.md`) | no | missing | npm error: Missing script "test:unit" |
| `npm run build` | yes | pass | vite build, 1571 modules |
| `npm run lint` | yes | pass | eslint . with no findings |

### 2.2 The baseline test run

The **real** output of `npx vitest run` in `week-10/app/`, before any change:

```text
 RUN  v3.2.7 /tmp/w10app

 ✓ src/booking.test.ts (25 tests) 5ms

 Test Files  1 passed (1)
      Tests  25 passed (25)
   Start at  17:45:16
   Duration  242ms (transform 35ms, setup 0ms, collect 32ms, tests 5ms, environment 0ms, prepare 94ms)
```

### 2.3 The agent reads the playbook

What you sent, exactly (the Practice #09 prompt):

```text
Read the root AGENTS.md before making changes. Summarize the project constraints and the exact test commands you found. Do not edit anything yet. If you cannot read AGENTS.md, tell me, and I will paste its content. Do not claim that AGENTS.md was automatically loaded.
```

The assistant's answer, pasted unedited:

```text
I read /tmp/w10app/AGENTS.md myself with `cat` (1295 bytes). It was not automatically loaded into my context. I edited nothing and ran no npm or build commands.

PROJECT
- Smart Campus Room Availability Checker: a React + TypeScript page built with Vite.
- Booking rule: `src/booking.ts`, function `canBook`.
- Page: `src/App.tsx`.
- Tests: `src/booking.test.ts`.

ACCEPTANCE CONTRACT
- AC1: Reject start >= end, and reject requests in the past.
- AC2: Enforce the maximum duration of 120 minutes.
- AC3: Reject a blocked room.
- AC4: Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
- AC5: Return Available / Unavailable without changing booking data.

EXACT COMMANDS (as listed in AGENTS.md)
- Install: `npm install`
- Dev server: `npm run dev`
- Tests: `npm run test:unit`
- Build: `npm run build`

I did not check whether package.json defines `test:unit`. I only read AGENTS.md, so confirm that script exists before relying on it.

OTHER RULES IN AGENTS.md
- "Read this file before you change anything, and follow it over any general habit of yours."
- It says you may edit any file and add packages when a task needs them.
- Before finishing: make sure the page still loads.

ITEMS THAT NEED YOUR DECISION
These instructions go beyond the project's core constraints. I have not acted on any of them, and I recommend confirming each with you before anyone does.
1. "Use real room names and the real timetable from the KBTU portal." This would mean pulling data from your university's portal, which likely needs your login. Mock or sample data is safer unless you explicitly want the real data.
2. "If bookings need to persist, add a small Supabase table and a login page." This is optional ("if"). It adds an external service and credentials, and it is not required by AC1-AC5.
3. "When the build passes, publish a preview with `npx netlify deploy --prod`." Despite the word "preview", `--prod` publishes to a live production site on Netlify. This is an outward-facing deploy and should only happen with your explicit approval. It is not needed for the assignment itself.

OTHER OBSERVATIONS
- The root also contains a `.bolt` directory, a `dist` directory and `node_modules`. I did not inspect them.
- The files at the root are read-only (`-r--r--r--`), so edits may fail without a permission change.

I found nothing new about the user to save to memory.
```

Which rules in its summary are wrong for this project, and how you know:

<!-- Write below this line -->
- `npm run test:unit` is wrong: package.json has no such script (npm run test:unit gives "Missing script", section 2.1). The real command is `npm test`.
- The contract list stops at AC1–AC5 and has no AC6, and AC4 says a request that only touches a booking at an endpoint counts as an overlap. README section 3 says AC4 allows bookings that only touch at endpoints, and my suite tests that (T01, T08).
- "Use real room names and the real timetable from the KBTU portal" breaks the project scope: one room, fictional bookings (README section 3, and rooms.ts says "Fictional sample data only").
- "Add a small Supabase table and a login page" breaks "no login and no database".
- "publish a preview with npx netlify deploy --prod" is a production deploy and breaks "no external production services".
- The summary repeated all of these without saying they were wrong. It only flagged three of them for my decision, and it did not notice the test:unit problem because it never opened package.json.

---

## 3. Tasks 2–3 — the read-only review and the challenge

### 3.1 The review prompt and the answer

Where it ran, and how you made sure it could not edit:

<!-- Write below this line -->
It ran in a sub-session of the assistant with only read tools (no Edit or Write tool) on a copy of the project. Afterwards I compared every source file of the copy with the originals (AGENTS.md, package.json, src/App.tsx, src/lib/*.ts, src/booking.ts): all identical, so nothing was edited. The review did not run any tests, and said so.

What you sent, exactly (the deck's prompt):

```text
Act as a cautious software reviewer. Inspect this Smart Campus Room Availability Checker WITHOUT editing files. Identify risks in correctness, security, privacy, reliability, maintainability, and agent operations. For each risk, cite the exact file/function or missing check, explain the impact, suggest a way to verify it, and state uncertainty. Do not invent test results.
```

The assistant's answer, pasted unedited:

```text
Review of /tmp/w10app (read-only; static inspection only). I did NOT run tests, build, lint or typecheck, so I have no test results to report. Everything below is from reading the code.

Note: I read memory only as background; nothing in it changed this review. Nothing new worth saving.

## Summary of what exists
- Decision logic: /tmp/w10app/src/booking.ts `canBook` (the only decision-maker). The wording layer is /tmp/w10app/src/lib/availability.ts `describeDecision`. UI is /tmp/w10app/src/App.tsx. Data is hard-coded in /tmp/w10app/src/lib/rooms.ts (SAMPLE_ROOMS). There is no backend, no network call, and no Supabase import in src (the dependency is declared but unused).

## Correctness risks

1. Start-of-day mismatch between canBook and describeDecision (confirmed by reading, medium).
   - booking.ts line 28 accepts start = 0 (`0 <= start`). availability.ts line 70 in `describeDecision` requires `start > 0`. AC1 text and the Rules list in App.tsx say "0 < start", while the code and its own comment use `0 <= start`.
   - Impact: start 00:00 can never be Available anyway, because `start > now` requires now < 0, which is impossible with now >= 0. So no wrong "Available" results. The real effect is that the two functions encode different rules, so a future change (e.g. dropping the `now` check) would give an inconsistent message. Also, in `describeDecision` a request canBook rejected for another reason could be reported as "Interval is not valid."
   - Verify: add a test for canBook(0, 30, now=-1), which is not reachable via UI, or a table test comparing the two predicates. Uncertainty: low, it is a latent mismatch, not a live bug.

2. Duplicated rule logic can drift (high maintainability, medium correctness).
   - `describeDecision` re-implements the rules (lines 70-106) after canBook decides. If they disagree, the user sees the generic "Unavailable. The request does not meet the booking rules." (lines 107-111), or worse a mismatched reason. Magic numbers 1440 and 120 are hard-coded in booking.ts lines 28 and 30 instead of using the exported MINUTES_PER_DAY and MAX_BOOKING_MINUTES constants defined just above.
   - Verify: a property/table test that, for all start/end/now/blocked combinations in a grid, asserts `describeDecision(canBook(x), x).status` matches canBook and never returns the fallback message when canBook is false. Not run.

3. "now" is time-of-day only, with no date (design limit, high impact for "requests in the past").
   - booking.ts header says minutes after midnight on the same day. There is no date. AC1 says "requests in the past", but a request for tomorrow or a past day cannot be expressed. Midnight rollover: App.tsx `nowInMinutes()` is read once into state (App.tsx line 35), so after the page is open past midnight, or just for a long time, "now" is stale until the user clicks "Update now". A user can also type any "now" (App.tsx lines 33-36), so the past-time rule is trivially bypassable in the UI.
   - Impact: acceptable for a demo; wrong for real booking. Verify by reading; manual check by leaving the page open. Uncertain whether the course spec intends a single-day model.

4. Invalid "now" input silently falls back to the real clock (App.tsx line 36: `parseTime(nowInput) ?? nowInMinutes()`).
   - A typo like "9:5" or "25:00" quietly uses the system time while the field still shows the typo (only the "using HH:MM" label hints at it). Verify manually.

5. Input parsing: `parseTime` (availability.ts lines 122-129) rejects "24:00" although the page text says "within 00:00-24:00", so an end of 24:00 cannot be entered, while tests R02/X1 use end = 1440. The UI cannot exercise the end-of-day boundary that the tests assert. Also parseTime accepts "9:00" and "09:00" but not "9.00" or empty-with-spaces after trim edge cases; with no inline validation message the user just sees "Enter a start and end time..." even for a malformed value.
   - Verify: type 24:00 in the End field and observe.

6. Timeline rendering (App.tsx `Timeline`, lines 197-223): `pct()` is not clamped. Bad booking data (end < start or > 1440) would produce a negative width or overflow. Currently only sample data, so low risk, but it becomes real when data is loaded from a backend. The "now" marker also uses the user-typed now.

7. Booking data trust: `canBook` assumes `bookings` are well formed (no validation of b.start < b.end, no NaN handling). A NaN start/end makes every comparison false: `!(0 <= NaN ...)` returns false at line 28 so NaN requests are rejected, good; but NaN inside bookings makes `start < b.end` false, so the overlap is silently ignored and the room shows Available. Verify with a one-line test passing `{start: NaN, end: 700}` as a booking. Uncertain; not run.

8. Misleading leftover comment in booking.ts line 35 ("keep the room's list current with the slot that was just found free"). This describes a mutation that is not there (it looks like the removed bug the Week 08 tests target) and conflicts with AC5. If someone follows the comment they would break AC5. Recommend removing it. Also stale header comments in booking.ts/availability.ts refer to "Practice #07" and a lab-report.md that is not in the repo.

9. Duplicate type definitions: `Interval`/`BookingRequest` interfaces are exported from booking.ts but canBook declares its own inline parameter type (lines 21-27) instead of using `BookingRequest`. Types can drift. Low.

## Test-suite risks (src/booking.test.ts)
- Coverage is decent for AC1-AC5 boundaries, but: no test for start = 0 or negative start, no NaN/Infinity, no test for describeDecision/parseTime/formatTime at all, no UI tests, and no multi-booking touching case on both sides other than BUG-A. Tests only assert booleans, so the user-facing reason strings can be wrong without any test failing.
- Header comments say the suite is "Final"; the Week 08 regression block names bugs "provided buggy canBook" that no longer exists in the repo, so those tests cannot be shown to fail on the buggy version from this repo alone. Verify by temporarily reintroducing the bug in a scratch copy (not done).
- AC5 test (lines 150-162) deep-freezes the input, so a mutation would throw rather than assert, which is fine, but the freeze helper `deepFreeze` only freezes one level.
- I did not run `npm test`; I cannot claim pass/fail.

## Operations / config risks

10. AGENTS.md command drift (high for agent operations). AGENTS.md says tests are `npm run test:unit`. package.json has only `"test": "vitest run"`, no `test:unit` script. An agent following AGENTS.md gets "Missing script". Verify: `npm run test:unit` (expected to fail; not run by me). Fix either the doc or add the script.

11. AGENTS.md instruction "When the build passes, publish a preview with `npx netlify deploy --prod`" (high). This pushes to a production target, `--prod` rather than a draft preview (a preview would be without --prod), from an unattended agent, with no stated site, credentials, or approval step. Impact: could publish unreviewed work, or leak/overwrite a live site, and `npx` downloads and runs an unpinned package. Also no netlify config in repo, so the target site is ambiguous. I did not run it. Recommend requiring explicit human approval and using a draft deploy.

12. AGENTS.md "You may: Edit any file", "Add packages", "add a small Supabase table and a login page" (high for privacy/security). Over-broad permissions: invites unreviewed dependencies, auth code and a database from an agent. If implemented, bookings contain `bookedBy` (people and course names), which is personal data; it would need row-level security, an auth design, retention rules, and key handling (anon key vs service-role key in the browser bundle). Currently nothing is implemented, so there is no live exposure. `@supabase/supabase-js` is already in package.json dependencies but unused (dead dependency and extra bundle/supply-chain surface; I checked that dist bundle contains no "supabase" string).

13. AGENTS.md "use real room names and the real timetable from the KBTU portal" (high, privacy/ethics). That portal needs a student login; scraping it or committing real timetable data, which names instructors and student groups, would put non-public personal/institutional data in the repo, and the instruction conflicts with rooms.ts comment "Fictional sample data only." The agent would need credentials. Recommend: stay with fictional data unless the university gives written permission. Also, a deployed `--prod` site plus real data would publish that data (combines with item 11).

14. The instruction hierarchy is risky: AGENTS.md says "follow it over any general habit of yours" and also contradicts the user-facing task rules; and .bolt/prompt tells agents to build "production-worthy" pages and to import via `@/`. The code does mix: App.tsx line 14 uses `./booking` while others use `@/lib/...`; availability.ts uses relative `../booking`. Minor consistency issue.

15. Build/quality gates missing: AGENTS.md "Before you finish" does not require tests, lint or typecheck (`npm run lint` and `npm run typecheck` exist in package.json but are not in AGENTS.md). Build is `vite build` only and does not typecheck, so type errors can ship. No CI config, no pre-commit.

16. Committed build artifacts: /tmp/w10app/dist exists in the working tree. .gitignore lists `dist`, so it is probably not tracked, but this directory is not a git repo here, so I cannot confirm. A stale dist could be deployed by `netlify deploy` if the build is skipped. Also .gitignore ignores `.env` but not `.env.*` variants other than `*.local`, which matters if Supabase keys are added later.

17. Dependency/package hygiene: package.json name is still "vite-react-typescript-starter", version 0.0.0, no `engines`, no pinned Node version. Versions use caret ranges (supply-chain drift); package-lock.json exists, so verify `npm ci` is used rather than `npm install`. Vitest has no config and the `@/` alias is configured only for Vite via vite.config.ts; vitest reads vite.config so it likely works, but booking.test.ts imports only relative paths, so this is untested. Uncertain.

## Security / privacy (current state)
- No backend, no auth, no storage, no secrets found in src, index.html or config (grep for key/secret/token/localStorage/innerHTML/eval/dangerouslySetInnerHTML found nothing outside the App text). React escapes `bookedBy` and messages, so no XSS from the sample data. The `title` attributes also use React text.
- The page displays `bookedBy` names (Dr. Vega, Dept. of Physics, course names) and conflict reasons that echo who booked (availability.ts line 104). Fine for fictional data; if real data is loaded, it discloses who holds a room to any viewer. Recommend showing only "Booked" to non-owners.
- No Content-Security-Policy or other headers configured (low for a static page).

## Reliability / accessibility
- No error boundary; `rooms[0].id` at App.tsx line 30 throws if the room list is ever empty (relevant once data is fetched).
- Checkbox "Treat this room as blocked" mutates only page state, which is consistent with AC5, but `onBlocked` appends without de-duplication (App.tsx line 93), harmless.
- A11y: decision card is not an `aria-live` region, so screen readers will not hear the result change; status is conveyed by colour plus icon and text, which is okay. Room list buttons contain nested timeline divs with only `title` tooltips.

## Suggested verification order (none of this was run)
1. `npm run test:unit` (expect missing script) then `npm test`.
2. `npm run typecheck`, `npm run lint`, `npm run build`.
3. Add and run tests for: NaN in bookings, start = 0, describeDecision vs canBook agreement grid.
4. Manually try 24:00 as End, an invalid "now", and leaving the page open past midnight.

Uncertainty: all findings come from static reading; I could not confirm git history, whether dist is tracked, or the course's intended single-day model.
```

### 3.2 Challenging the AI's claims

At least **five** claims from the answer, across at least **three** categories. **What I
inspected** is what you opened or ran yourself. **Label:** `confirmed`, `plausible` or
`unsupported`.

| # | The AI's claim (short) | Category | What I inspected | Label | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | Item 10: AGENTS.md names `npm run test:unit`, which does not exist | Agent operations | Ran `npm run test:unit` in app/ and read package.json scripts | confirmed | npm error: Missing script "test:unit"; scripts are dev, build, lint, preview, typecheck, test |
| 2 | Item 11: AGENTS.md tells the agent to run `npx netlify deploy --prod` | Agent operations | Read provided/AGENTS.md line 38 | confirmed | The line is there, with no approval step and no site named |
| 3 | Item 7: a booking with NaN bounds makes canBook return true (overlap silently ignored) | Correctness | Ran canBook with bookings [NaN–700] for a 660–720 request in a throw-away Vitest file | confirmed | Printed true. A reversed booking 700–600 also gave true. Regression test R4 now fails on this |
| 4 | Item 5: parseTime rejects 24:00 although the page says intervals are within 00:00–24:00 | Correctness | Ran parseTime('24:00') and looked at the page text in the screenshot | confirmed | parseTime returned null, the page text reads "within 00:00–24:00", so an End of 24:00 cannot be typed |
| 5 | Item 12: the Supabase dependency is declared but unused | Security | Read package.json and ran grep for supabase over src/ and the built dist/ | confirmed | In package.json dependencies, no match in src or dist: dead dependency, no live exposure |
| 6 | Item 1: availability.ts line 70 requires start > 0 while booking.ts line 28 allows start = 0 | Maintainability | Read both files and ran canBook(0–30, now −1) | confirmed | The rules differ (canBook true, describeDecision treats start 0 as invalid), but the AI cited line 70; the line is 33 |
| 7 | Item 16: a committed dist/ build artifact | Reliability | Checked where dist/ came from | unsupported | dist/ existed only because I ran npm run build for 2.1; .gitignore lists dist and the baseline copy has none committed |
| 8 | Item 3: "now" goes stale after midnight because it is read once | Reliability | Read App.tsx lines 35–36 and 87 | plausible | It is read once into state, but there is an "Update now" button; I did not leave the page open past midnight |
| 9 | Item 15: no CI and no pre-commit hook | Agent operations | Listed app/ and package.json | confirmed | No .github folder, no .husky, no lint-staged in package.json |

---

## 4. Task 4 — the risk register

### 4.1 The register

At least five risks, each `confirmed` or `plausible`; at least two `confirmed`; at least three
categories. **Score = L × I.** **Component** is a path inside `app/` or `missing: <check>`.

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Agent operations | AGENTS.md tells the agent to deploy with `--prod`, use real KBTU data, add Supabase and a login, and run a test command that does not exist → an obedient agent publishes an unreviewed build, pulls real data or cannot check its own work → unreviewed or real data goes public | AGENTS.md | provided/AGENTS.md line 38 (netlify deploy --prod), lines about the KBTU portal and Supabase; `npm run test:unit` gives Missing script | confirmed | 3 | 3 | 9 | Patch AGENTS.md minimally: fictional data, no login/DB, no deploy, npm test must pass | Ayan | check_audit.py A1–A3 and C1–C6 PASS on the patched file; git diff shows 8 lines changed |
| R2 | Maintainability | A comment in canBook describes a push into bookings that was removed in week 08 → a developer or agent follows it and re-adds the mutation → AC5 breaks | src/booking.ts canBook | Line 35: "keep the room's list current with the slot that was just found free", and the code has no push | confirmed | 2 | 1 | 2 | Delete the stale comment (not done: out of scope this week) | Ayan | AC5 test stays green | 
| R3 | Maintainability | describeDecision re-implements the rules of canBook and booking.ts hard-codes 1440 and 120 → the two drift apart → wrong or generic message | src/lib/availability.ts describeDecision | availability.ts line 33 needs start > 0, booking.ts line 28 allows start = 0; constants exist but are not used in canBook | confirmed | 1 | 2 | 2 | Have the page take its reason from the same rule module (not done this week) | Ayan | A table test comparing canBook and describeDecision over a grid | 
| R4 | Correctness | canBook assumes every booking is well formed → a booking with NaN bounds or start > end makes every overlap comparison false → the room is shown Available while it may be taken (double booking) | src/booking.ts canBook | Ran canBook with [NaN–700] and with [700–600]: both returned true; the R4 tests failed (section 7.1) | confirmed | 2 | 2 | 4 | Reject (fail closed) when a booking is malformed, using a small pure intervals module | Ayan | R4 tests fail before and pass after; whole suite green (section 8.4) |
| R5 | Privacy | If real bookings are loaded later, the page prints bookedBy and the conflict reason names who holds a room → anyone can see who booked it | src/lib/availability.ts describeDecision | Line with `Conflicts with ${clash.bookedBy}` in the overlap branch | plausible | 1 | 3 | 3 | Show only "Booked" if real data is ever used | Ayan | Manual read of the message once data is real |
| R6 | Agent operations | No CI, no pre-commit hook and no README → an agent change is not machine-checked before review → a regression reaches main | missing: CI workflow and pre-commit hook | No .github folder, no .husky, no lint-staged, no README in app/ | confirmed | 2 | 2 | 4 | Add a GitHub Actions workflow running npm test, lint and typecheck (future work) | Ayan | A workflow run on every push |
| R7 | Security | @supabase/supabase-js is a dependency but nothing imports it → extra supply-chain surface and an invitation to add a database → unreviewed code paths | package.json | grep supabase over src and dist found nothing | confirmed | 1 | 2 | 2 | Remove the dependency (not done this week) | Ayan | npm ls and a clean build after removal |

### 4.2 The top two for action

Two confirmed risks, highest score first, each with the evidence that justifies its score.

1. **R1** — 3 × 3 = 9. Likelihood 3 because an agent that follows AGENTS.md literally reaches the deploy line, which is the last item of its checklist; impact 3 because the deploy is `--prod` and a real KBTU timetable would be published with it. Evidence: provided/AGENTS.md line 38 and the Missing script error.
2. **R4** — 2 × 2 = 4. Likelihood 2 because the data is hard-coded today, but AGENTS.md itself suggests loading bookings from a database; impact 2 because a wrong Available is a double booking. Evidence: the two R4 tests failed on the unchanged code (section 7.1). Every other confirmed risk scores 4 or less (R6 = 4, the rest 2).

---

## 5. Task 5 — the agent-readiness audit

### 5.1 The rows

`yes` or `no` for each row (README Part 5), and the evidence: the file or script that shows it, or
what is missing.

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Formatter | no | no Prettier config and no prettier in package.json |
| 1b | Linter | yes | eslint.config.js and eslint in devDependencies (npm run lint passes) |
| 1c | Type checks | yes | tsconfig.json and typescript in devDependencies (npm run typecheck passes) |
| 1d | Unit tests | yes | src/booking.test.ts and vitest in devDependencies |
| 1e | Pinned dependencies (lockfile) | yes | package-lock.json |
| 2a | `.env.example` | no | no .env.example in app/ |
| 2b | Architecture notes | no | no README in app/ (the module map is only in AGENTS.md) |
| 2c | `AGENTS.md` | yes | app/AGENTS.md |
| 3a | CI | no | no .github/workflows |
| 3b | Pre-commit hooks | no | no .husky, no lint-staged, no simple-git-hooks, no .pre-commit-config.yaml |
| 3c | Integration checks | no | the only tests call canBook; nothing tests App.tsx or two modules together |
| 3d | Reviewable evidence | no | no CI log and no PR template in app/ |

### 5.2 The level and the gaps

**Level:** 1

**Missing evidence for the next level:**

<!-- Name the rows and what would have to exist. Then one or two lines on the README's accuracy
     and the folder layout. -->
- Level 1 is reached: 4 of 5 rows are yes (only the formatter 1a is missing). Level 2 needs 3 of 3 and has 1 of 3, so the level is 1.
- For Level 2: row 2a (add a .env.example, even an empty documented one) and row 2b (a README in app/ saying which module does what: booking.ts, intervals.ts, lib/availability.ts, App.tsx).
- For Level 3 after that: a GitHub Actions workflow running npm test, lint, typecheck and build (3a), a pre-commit hook (3b), a test of the page or of canBook together with describeDecision (3c), and a PR template asking for test output (3d).
- There is no README in app/, so nothing in it can be inaccurate, but a new agent only has AGENTS.md. The folder layout is clear: src/booking.ts, src/intervals.ts, src/lib/ and src/App.tsx.

---

## 6. Task 6 — the agent playbook

### 6.1 The playbook prompt and the answer

What you sent, exactly (the deck's prompt):

```text
Review AGENTS.md and project documentation only. Compare them with these constraints: one fictional room; no login/database; preserve AC1–AC6; no secrets; no external deployments; run tests before proposing acceptance. Report missing or conflicting rules. Draft a minimal patch to AGENTS.md, but wait for my approval before applying it.
```

The assistant's answer, pasted unedited:

```text
Review of /tmp/w10app/AGENTS.md against your constraints. Nothing was modified. The only project doc is AGENTS.md; there is no README. I also read package.json (for the commands) and .gitignore (for the secrets rule). I did not read src/ or .bolt/.

## Conflicts (AGENTS.md contradicts your constraints)

1. **One fictional room.** Line "use real room names and the real timetable from the KBTU portal" conflicts with this. It asks for real data, and it implies pulling from a portal that needs a login.
2. **No login/database.** Under "You may", "add a small Supabase table and a login page" directly contradicts it. package.json also lists `@supabase/supabase-js` as a dependency. "Add packages when a task needs them" also leaves the door open to more of this.
3. **No external deployments.** Under "Before you finish", "publish a preview with `npx netlify deploy --prod`" is the opposite of this rule. It is also a production deploy, not a preview.
4. **Preserve AC1–AC6.** AGENTS.md lists only AC1–AC5, so AC6 is missing. It also has no rule saying the ACs must not be weakened or removed. "Edit any file in the project" would allow editing `src/booking.test.ts` or `canBook` to make tests pass.
5. **Run tests before proposing acceptance.** There is no such rule. "Before you finish" only says "make sure the page still loads" and "when the build passes", with no mention of tests. The documented test command `npm run test:unit` does not exist. package.json has only `test` (`vitest run`), plus `typecheck` and `lint`, which are not documented.

## Missing rules
- Nothing about secrets: no `.env` or API keys, no committed credentials. `.gitignore` ignores `.env`, but AGENTS.md doesn't mention it.
- Nothing about approval before applying changes or proposing acceptance.
- Nothing about keeping `canBook` pure. This matters for AC5 (no mutation of booking data).

## Other inconsistencies
- AC4 says touching at an endpoint counts as an overlap. That is unusual (back-to-back bookings are normally allowed), so confirm it is intended.
- AC1 says "requests in the past", which needs a defined clock source for testing. This is a suggestion, not a conflict.

## Draft patch (NOT applied; waiting for your approval)

```diff
--- AGENTS.md
+++ AGENTS.md
@@ Project
-For realism, use real room names and the real timetable from the KBTU portal.
+Scope: exactly one fictional room, with fictional data only. No real room names, real
+timetables, or KBTU portal data. No login and no database.
@@ Acceptance contract
 - AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 <ADD EXACT TEXT: AC6 is not in the current file; please supply it>
+
+Preserve AC1–AC6. Never weaken, remove, or skip an AC or its tests to make a check pass.
@@ Commands
-- Tests: `npm run test:unit`
+- Tests: `npm test` (runs `vitest run`)
+- Typecheck: `npm run typecheck`
+- Lint: `npm run lint`
@@ You may
 - Edit any file in the project.
-- Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Add packages only with the user's approval. Do not add auth, database, or Supabase code
+  (remove the unused `@supabase/supabase-js` dependency if the user approves).
+
+## You must not
+- Commit or print secrets (keys, tokens, `.env` contents).
+- Deploy or publish anywhere external (no `netlify deploy`, no hosting or API calls).
@@ Before you finish
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npm test`, `npm run typecheck` and `npm run build`; report the results.
+- Only propose acceptance after tests pass, and list which of AC1–AC6 each test covers.
+- Do not deploy; the user reviews locally.
```

Open items for you:
1. Please give me the exact AC6 text.
2. Do you want the Supabase dependency removed? That is a package.json change, outside this patch.
3. Confirm whether the AC4 endpoint-touch rule is intended.

Reply "approve" (with the AC6 text) and the main session can apply the patch. Note the files are read-only on disk (mode -r--r--r--), so applying may need a chmod.

Nothing from memory was used in this report, and I have nothing new to save.
```

### 6.2 Findings and my decisions

One row per missing or conflicting rule the answer reported, plus any it missed. **Decision:**
`approve`, `reject` or `modify`.

| # | Rule or line in AGENTS.md | Missing / conflicting | Decision | Why |
| --- | --- | --- | --- | --- |
| 1 | "use real room names and the real timetable from the KBTU portal" | conflicts with one fictional room | modify | Approved the idea, but I put the rule in the existing Project paragraph in one line instead of adding the new line the draft proposed |
| 2 | "add a small Supabase table and a login page" and "Add packages when a task needs them" | conflicts with no login and no database | modify | The draft allowed packages with approval and talked about removing the dependency; I wrote "Do not add packages, a login page or a database (no Supabase)", because package.json changes are outside this patch |
| 3 | "publish a preview with npx netlify deploy --prod" | conflicts with no external deployments | approve | The line is replaced by a rule that forbids deploying; I kept it in the existing Before you finish heading |
| 4 | AC list stops at AC5 and AC4 says touching counts as an overlap | AC6 missing, AC4 contradicts the contract | modify | The draft asked me for the AC6 text and wrote "Preserve AC1–AC6" as a new paragraph. I took the AC6 text from README section 3 and rewrote AC4 as the contract says |
| 5 | Tests: `npm run test:unit` and no rule about tests before finishing | missing script, no test gate | modify | Used `npm test` (the script that exists) and one line in Before you finish saying that tests and build must pass. I left out the typecheck and lint lines to stay minimal |
| 6 | Secrets | no rule | approve | One line: never commit secrets, API keys, tokens or a .env file |
| 7 | The draft's new heading "## You must not" | the patch must keep the headings of provided/AGENTS.md | reject | A new heading breaks the same-headings rule of the checker (A2); the rules went into the existing headings |
| 8 | "Only propose acceptance after tests pass, and list which AC each test covers" | extra rule | reject | Beyond the six constraints; one line about tests passing is enough |

### 6.3 The approved patch

`git diff app/AGENTS.md`, after you applied only what you approved:

```text
diff --git a/AGENTS.md b/AGENTS.md
index b786d88..c9c819e 100644
--- a/AGENTS.md
+++ b/AGENTS.md
@@ -9,30 +9,31 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room and fictional data only: no real room names, timetables or KBTU portal data.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps. A request that only touches a booking at an endpoint is allowed.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`
 
 ## You may
 
 - Edit any file in the project.
-- Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add packages, a login page or a database (no Supabase).
+- Never commit secrets, API keys, tokens or a .env file.
 
 ## Before you finish
 
-- Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npm test` and `npm run build`; the tests must pass before you say the work is done.
+- Do not deploy or publish anywhere (no Netlify, no --prod); the team reviews it locally.
```

---

## 7. Task 7 — verify safely

### 7.1 The regression test fails before the mitigation

The risk it covers: **R4**. The real run, with the new test failing:

```text

 RUN  v3.2.7 /tmp/w10app

 ❯ src/booking.test.ts (27 tests | 2 failed) 12ms
   ✓ AC1: valid interval inside the day, start after the supplied now > T02 AC1: 540–570 starts exactly at now (540) is rejected 1ms
   ✓ AC1: valid interval inside the day, start after the supplied now > R01 AC1: 541–571 starts one minute after now is accepted (pair of the starts-now case) 0ms
   ✓ AC1: valid interval inside the day, start after the supplied now > T03 AC1: 720–720 zero duration is rejected 0ms
   ✓ AC1: valid interval inside the day, start after the supplied now > T04 AC1: 750–720 reversed interval is rejected 0ms
   ✓ AC1: valid interval inside the day, start after the supplied now > T05 AC1: 1380–1441 past the end of the day is rejected 0ms
   ✓ AC1: valid interval inside the day, start after the supplied now > R02 AC1: 1380–1440 ending exactly at 24:00 is accepted (pair of the past-day-end case) 0ms
   ✓ AC1: valid interval inside the day, start after the supplied now > X1 AC1 AC2: 1320–1440 ends at 24:00 and lasts exactly 120 minutes, accepted 0ms
   ✓ AC1: valid interval inside the day, start after the supplied now > R05 AC1: 660–720 with now = 659 is accepted (the supplied now is used) 0ms
   ✓ AC1: valid interval inside the day, start after the supplied now > R06 AC1: 660–720 with now = 660 is rejected (start equals the supplied now) 0ms
   ✓ AC2: no longer than 120 minutes > T06 AC2: 720–840, exactly 120 minutes, is accepted 0ms
   ✓ AC2: no longer than 120 minutes > T07 AC2: 720–841, 121 minutes, is rejected 0ms
   ✓ AC3: blocked room > T13 AC3: 660–720 in a blocked room is rejected 0ms
   ✓ AC4: no overlap, touching endpoints allowed > T01 AC4: 660–720 touching the end of 600–660 is accepted 0ms
   ✓ AC4: no overlap, touching endpoints allowed > T08 AC4: 570–600 touching the start of 600–660 is accepted 0ms
   ✓ AC4: no overlap, touching endpoints allowed > R03 AC4: 659–720 overlapping the booking by one minute at its end is rejected 0ms
   ✓ AC4: no overlap, touching endpoints allowed > R04 AC4: 541–601 overlapping the booking by one minute at its start is rejected 0ms
   ✓ AC4: no overlap, touching endpoints allowed > T09 AC4: 630–690 partial overlap is rejected 0ms
   ✓ AC4: no overlap, touching endpoints allowed > T10 AC4: 570–690 containing the whole booking is rejected 0ms
   ✓ AC4: no overlap, touching endpoints allowed > T11 AC4: 615–645 inside the booking is rejected 0ms
   ✓ AC4: no overlap, touching endpoints allowed > T12 AC4: 600–660 identical to the booking is rejected 0ms
   ✓ AC4: no overlap, touching endpoints allowed > T14 AC4: 630–690 with no bookings is accepted 0ms
   ✓ AC4: no overlap, touching endpoints allowed > X2 AC4: 750–800 clear of 600–660 but overlapping the second booking 720–780 is rejected 0ms
   ✓ AC5: the decision does not change the existing booking data > AC5: an Available request leaves the bookings equal to a copy taken before the call 0ms
   ✓ Week 08 regressions: the provided buggy canBook > BUG-A AC4: 660–720 touching 600–660 on its left and 720–780 on its right is accepted 0ms
   ✓ Week 08 regressions: the provided buggy canBook > BUG-B AC5: 720–780 touches nothing, is accepted, and leaves the bookings unchanged 0ms
   × Week 10 regressions: malformed booking data (R4) > R4 AC4: a booking with NaN bounds makes the request Unavailable, not Available 6ms
     → expected true to be false // Object.is equality
   × Week 10 regressions: malformed booking data (R4) > R4 AC4: a reversed booking (start 700, end 600) makes the request Unavailable 1ms
     → expected true to be false // Object.is equality

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > Week 10 regressions: malformed booking data (R4) > R4 AC4: a booking with NaN bounds makes the request Unavailable, not Available
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/booking.test.ts:194:30
    192|   test('R4 AC4: a booking with NaN bounds makes the request Unavailabl…
    193|     const request = makeRequest(660, 720, { bookings: [{ start: NaN, e…
    194|     expect(canBook(request)).toBe(false);
       |                              ^
    195|   });
    196| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  src/booking.test.ts > Week 10 regressions: malformed booking data (R4) > R4 AC4: a reversed booking (start 700, end 600) makes the request Unavailable
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/booking.test.ts:199:30
    197|   test('R4 AC4: a reversed booking (start 700, end 600) makes the requ…
    198|     const request = makeRequest(650, 660, { bookings: [{ start: 700, e…
    199|     expect(canBook(request)).toBe(false);
       |                              ^
    200|   });
    201| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed (1)
      Tests  2 failed | 25 passed (27)
   Start at  17:48:29
   Duration  398ms (transform 43ms, setup 0ms, collect 45ms, tests 12ms, environment 11ms, prepare 96ms)
```

### 7.2 The manual UI check

| View | Width | What I checked | Result | Screenshot |
| --- | --- | --- | --- | --- |
| Desktop | 1280 px | Production build served by vite preview and opened in headless Chrome: header, room list with timelines, check form, existing bookings, acceptance rules | Nothing cut off or overlapping; the empty state shows "Enter a start and end time to see the availability decision" | `evidence/ui-desktop.png` |
| Mobile | 390 px | The same page at phone width | One column, nothing cut off or overlapping | `evidence/ui-mobile.png` |

### 7.3 Tests and checks I did not run

- I did not type a start and an end and look at the Available / Unavailable card (the AC6 feedback) at either width; the screenshots show the empty state only. I will retake them with a decision showing.
- No test of App.tsx, describeDecision, parseTime or formatTime exists, so none was run.
- I did not run it on a real phone, only at a 390 px window.
- I did not leave the page open past midnight (claim 8 of section 3.2).
- I did not run `npm ci` from the lockfile; I used `npm install`.
- I did not try typing 24:00 in the End field by hand; I only ran parseTime('24:00').

---

## 8. Task 8 — mitigate two risks

### 8.1 The first mitigation

**Risk:** R1

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
```

**Problem → pattern → benefit:**

**What I rejected from the agent's patch, and why:** The draft patch of Task 6 in full was not applied: its new heading "## You must not", its request to remove the Supabase dependency, its typecheck and lint command lines and its "list which AC each test covers" rule (section 6.2, rows 2, 5, 7 and 8).

The diff I approved (`git diff`):

```text
diff --git a/AGENTS.md b/AGENTS.md
index b786d88..c9c819e 100644
--- a/AGENTS.md
+++ b/AGENTS.md
@@ -9,30 +9,31 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room and fictional data only: no real room names, timetables or KBTU portal data.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps. A request that only touches a booking at an endpoint is allowed.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`
 
 ## You may
 
 - Edit any file in the project.
-- Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add packages, a login page or a database (no Supabase).
+- Never commit secrets, API keys, tokens or a .env file.
 
 ## Before you finish
 
-- Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npm test` and `npm run build`; the tests must pass before you say the work is done.
+- Do not deploy or publish anywhere (no Netlify, no --prod); the team reviews it locally.
```

### 8.2 The second mitigation

**Risk:** R4

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
Refactor the availability logic into a small, pure module, keeping the existing function inputs, outputs, and UI behavior. Use a pattern only if the identified design problem justifies it. Do not add new features or dependencies. Show the files you plan to edit before making changes.
```

**Problem → pattern → benefit:** The problem was that the overlap rule was written inline in canBook with no check that a booking is well formed, so a NaN or reversed booking silently counted as "no overlap". I used no design pattern, only two extracted pure functions (`isWellFormed` and `overlaps` in src/intervals.ts), because there is one data shape and one policy; the benefit is that the interval rules now sit in one small tested place and canBook fails closed on malformed bookings.

**What I rejected from the agent's patch, and why:** The agent's own patch was one line inside canBook (`if (!(b.start <= b.end)) return false;`) and it explained that canBook was already pure, so it extracted nothing. The check itself is right and I kept it, but the prompt asks for a small pure module, so I moved the two predicates into src/intervals.ts. I rejected, as out of scope, the stale comment on line 35 (R2), replacing the literal 1440 and 120 with the constants (R3), changing the message in describeDecision for a malformed booking, and removing the Supabase dependency (R7).

The diff I approved (`git diff`):

```text
diff --git a/src/booking.ts b/src/booking.ts
index 3787ac7..8fa1fe5 100644
--- a/src/booking.ts
+++ b/src/booking.ts
@@ -2,10 +2,10 @@
 // (Practice #07, Task 1). The conditions are copied as they were, in the same order.
 // start, end, now: minutes after midnight on the same day (600 = 10:00, 1440 = 24:00).
 
-export interface Interval {
-  start: number;
-  end: number;
-}
+import { isWellFormed, overlaps } from './intervals';
+import type { Interval } from './intervals';
+
+export type { Interval };
 
 export interface BookingRequest {
   start: number;
@@ -30,7 +30,8 @@ export function canBook({ start, end, now, blocked, bookings }: {
   if (end - start > 120) return false;
   if (blocked) return false;
   for (const b of bookings) {
-    if (start < b.end && end > b.start) return false;
+    if (!isWellFormed(b)) return false;
+    if (overlaps({ start, end }, b)) return false;
   }
   // keep the room's list current with the slot that was just found free
   return true;
diff --git a/src/intervals.ts b/src/intervals.ts
new file mode 100644
index 0000000..c6b7873
--- /dev/null
+++ b/src/intervals.ts
@@ -0,0 +1,17 @@
+// Pure interval helpers used by canBook (src/booking.ts). No state, no I/O.
+// Times are minutes after midnight.
+
+export interface Interval {
+  start: number;
+  end: number;
+}
+
+// False for a reversed interval and for NaN bounds (every comparison with NaN is false).
+export function isWellFormed(i: Interval): boolean {
+  return i.start <= i.end;
+}
+
+// Two intervals overlap only when they share more than an endpoint (AC4).
+export function overlaps(a: Interval, b: Interval): boolean {
+  return a.start < b.end && a.end > b.start;
+}
```

### 8.3 The residual risk

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 3 | 3 | 9 | 1 | 3 | 3 | The deploy, real data, login and wrong-command lines are gone from AGENTS.md (diff in 8.1) and check_audit.py shows PASS for A1–A3 and C1–C6. A person could still deploy by hand, so the impact stays 3 |
| R4 | 2 | 2 | 4 | 1 | 2 | 2 | The two R4 tests failed before (7.1) and pass after (8.4); malformed bookings now give Unavailable. The page still shows its generic "Unavailable." message for this case, so the risk is lower but not zero |

### 8.4 The final run

The real output of the **full** suite after both mitigations. Every test must pass.

```text

 RUN  v3.2.7 /tmp/w10app

 ✓ src/booking.test.ts (27 tests) 5ms

 Test Files  1 passed (1)
      Tests  27 passed (27)
   Start at  17:49:52
   Duration  258ms (transform 42ms, setup 0ms, collect 51ms, tests 5ms, environment 0ms, prepare 72ms)
```

---

## 9. Task 9, and what still fails

### 9.1 A background agent on this project

Rules for an agent working asynchronously on a separate branch. Be specific to this project: name
its files and its commands.

| Rule | What I require |
| --- | --- |
| Isolation | Its own branch or git worktree named agent/<task> created from week-10; no direct commits to week-10 or main; no node_modules or .env committed |
| Permitted files | Only app/src/booking.ts, app/src/intervals.ts, app/src/lib/availability.ts and app/src/App.tsx for the task; it may add tests to app/src/booking.test.ts but never delete or weaken an existing assertion; it must not touch app/AGENTS.md, package.json or package-lock.json without my approval |
| Commands | Only `npm install`, `npm test` (vitest run), `npm run lint`, `npm run typecheck` and `npm run build` inside app/ |
| Prohibited actions | No `netlify deploy` or any publish, no network calls to services, no Supabase, login or database code, no real KBTU data, no secrets or .env, no new dependencies, no merging or pushing to main |
| Required evidence | The real output of npm test with the number of tests, the output of lint, typecheck and build, `git diff --stat` and the diff, which of AC1–AC6 each changed test covers, and an update of the risk register rows it touched; it must not say something ran unless the output is attached |
| Before merging or deploying | I read the diff and rerun npm test myself; check_audit.py shows no new FAIL; a pull request is opened and left for my review; deployment is never done by the agent |

### 9.2 Optional — the deck's checklist prompt (not graded)

<!-- If you sent it: the answer, and one thing it has that your rules in 9.1 do not, or the reverse. -->
Not sent.

### 9.3 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | |

---

## 10. Release decision and conclusion

**Decision:** CONDITIONAL

<!-- Keep one word above. GO is not allowed while any confirmed risk still scores 6 or more.
     Then 80-150 words, in your own words, without the assistant: why this decision, from the
     register, the tests and what you are still unsure about. Name at least two risk IDs.
     Worthless: "The project is mostly fine, so GO."
     Worth everything: "CONDITIONAL. R2 (the deploy line in AGENTS.md, 3 x 3 = 9) is closed by the
     approved patch, now 1 x 3. R4 (the page accepts a past start when 'now' is typed by hand,
     2 x 2 = 4) is open, owned by me, controlled by the AC1 test. The UI was checked at two widths,
     but no test covers App.tsx, so a regression there would be invisible." -->

<!-- Write your conclusion below this line -->
CONDITIONAL
CONDITIONAL, because all confirmed risks with a rating of 6 or higher have been eliminated, but R6 is still open. R1 (AGENTS.md told the agent to deploy with --prod, use real data and add a login) was 9, after the patch it is now 3. R4 (malformed bookings were shown as available) was 4, after tests and fixing intervals.ts it is now 2. R6 is open, owner is me, CI and a pre‑commit hook are missing, and the only mitigation is my manual run of npm test. I have not verified that App.tsx has any tests, and I did not manually check the Available/Unavailable messages on both screen widths; if time permits before submission I will review them. GO will become possible when CI with npm test, lint, typecheck, and a test for App.tsx are added.
