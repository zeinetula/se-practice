# AI Usage Disclosure — Week 07

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude, a fresh assistant session with no earlier context | Claude Opus 5.5 (claude-opus-5-5), claude.ai | the first test suite (Task 3): it got the deck's generation prompt exactly as pasted in lab-report.md §4 and nothing else | `suites/first/booking.test.ts` (saved unedited); its answer in lab-report.md §4 |
| Claude, the same session as the row above | Claude Opus 5.5 (claude-opus-5-5), claude.ai | the improvement prompt (Task 5): the deck's prompt plus the real first-run output, as pasted in §6.2 | its answer in lab-report.md §6.2; ideas R01–R06 and the deep-freeze, taken into `app/src/booking.test.ts` |
| Claude, agent session with access to my `se-practice` folder | Claude Opus 5.5 (claude-opus-5-5), claude.ai | ran the whole workflow for me: extraction, Vitest install, all test and mutant runs, the review, the final suite, the page changes for Task 7, the UI screenshots, and drafting lab-report.md §1–§9, submission.yml and a commit script | `app/src/booking.ts`, `app/src/booking.test.ts`, `app/src/App.tsx`, `app/src/lib/availability.ts`, `app/package.json`, `app/package-lock.json`, `evidence/ui-1…5.png`, `lab-report.md` §1–§9, `submission.yml`, this file |

**I used an assistant to extract `canBook` (Task 1), or to fix a defect in it:** yes
<!-- If "yes": which change, in which file, and how you checked that the behaviour did not change. -->
The agent session moved the five conditions of `checkAvailability()` from `src/lib/availability.ts` into `canBook()` in `src/booking.ts` without changing any operator. `checkAvailability()` became `describeDecision()`, which only writes the message. To check the behaviour, the old and the new function were run side by side on 163,494 generated inputs with 0 differences, and both `tsc` and `vite build` pass. No defect was fixed: the first run had no failures.

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** yes
<!-- If "yes": which one, the exact model, and for which section. -->
The same model, Claude Opus 5.5, in the agent session (third row) drafted lab-report.md §1–§9. §10 is mine, written without the assistant. The manual UI checks (Task 7) were driven by the agent through headless Chrome (Playwright) on the built page, at 1280×900 and at 375×812 in phone mode, not by my own clicks. The observations in §8 come from those runs and screenshots.

**`suites/first/` holds the assistant's first test file exactly as it generated it:** yes

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes. The runs were made in Claude's cloud Linux workspace. The §7 mutant runs are filtered with `grep` to the RUN, FAIL and summary lines, and the `--- M…` labels are added; both are stated in §7.

**I can explain every test in my final suite — its input, its expected result and the AC behind it — without the assistant:** yes / no   <!-- Ayan: answer this yourself after reading app/src/booking.test.ts -->

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->
<!-- Ayan: fill this in yourself. Candidates to check: deepFreeze() and why a write throws in strict mode; structuredClone vs JSON.stringify in the AC5 test. -->

Signed: Ayan Zeinetula
Date: 8 November 2026
