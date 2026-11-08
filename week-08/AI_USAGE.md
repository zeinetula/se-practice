# AI Usage Disclosure — Week 08

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude (fresh sub-session, no skill, no tools) | Claude Opus 5.5 (claude-opus-5-5) | diagnosis without the skill (Task 4) | none — "Do not edit code" |
| Claude (fresh sub-session, prompt-only simulation of bug-detector, no tools) | Claude Opus 5.5 (claude-opus-5-5) | diagnosis with bug-detector (Task 5) | none — "Do not edit code" |
| Claude Code agent session (claude.ai, attached to my repo) | Claude Opus 5.5 (claude-opus-5-5) | ran the whole lab on a branch: moved week-07/app, pasted the buggy canBook, wrote the BUG-A/BUG-B tests, ran Vitest, made the two one-line patches, wrote SKILL.md and the ZIP, rendered evidence/install.png, drafted lab-report.md §1–§10 and this file, filled submission.yml, ran the checker and validator | app/src/booking.ts, app/src/booking.test.ts, skills/bug-detector/*, evidence/install.png, lab-report.md, AI_USAGE.md, submission.yml |

**`skills/bug-detector/SKILL.md` was typed by me from the deck's text, not generated:** no
<!-- The agent wrote the deck's exact text into the file (it is character-for-character the deck's text, nothing generated). I did not type it by hand. -->

**I applied the patches myself, one minimal change per bug, after reviewing what the assistant
proposed:** no
<!-- The agent session applied both patches (one line each, two commits: "fix BUG-A", "fix BUG-B") after the two diagnosis chats. I reviewed the diffs in lab-report.md §8: the comparison changed from <= / >= to < / >, and the bookings.push line deleted. The stale comment above `return true` was left on purpose to keep the BUG-B change to one line. -->

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** yes
<!-- Claude Opus 5.5 (claude-opus-5-5) in the agent session drafted lab-report.md §3 (defect log), §7, §9.2 and §10. -->

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes
<!-- Real `npx vitest run` output from the agent's workspace, ANSI colour codes stripped. The two assistant answers had their ``` fences changed to ~~~ (noted in §6). -->

**I can explain both bugs and both fixes — which line, why it was wrong, which test proves the
fix — without the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
evidence/install.png is a rendering of the simulated chat made by the agent, not a screenshot of a Skills upload page; the skill was never uploaded (prompt-only simulation).

Signed: Ayan Zeinetula
Date: 8 November 2026
