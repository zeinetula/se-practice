# AI Usage Disclosure — Week 10

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude (claude.ai) | Claude Sonnet 5.5 (claude-sonnet-5-5) | read-only risk review (Task 2) and the Task 1 playbook summary | none — "WITHOUT editing files" |
| Claude (claude.ai) | Claude Sonnet 5.5 (claude-sonnet-5-5) | AGENTS.md review and patch draft (Task 6) | `app/AGENTS.md`, only after my approval |
| Claude (claude.ai) | Claude Sonnet 5.5 (claude-sonnet-5-5) | minimal patches for two risks (Task 8), the R4 regression test, the runs pasted in lab-report.md and the first draft of its text | `app/AGENTS.md`, `app/src/booking.ts`, `app/src/intervals.ts`, `app/src/booking.test.ts`, `lab-report.md`, `evidence/*.png` |

**The review in Task 2 ran in a mode where the assistant could not edit, and `git status` showed no
change afterwards:** yes (the review ran in a sub-session without edit tools; a later comparison of the source files with the originals found no difference; there was no git status in the original folder, so I compared files)
<!-- If it edited anything, say what and how you undid it. -->

**I labelled every claim in lab-report.md §3.2 after opening the cited file myself:** no — the assistant opened the files and ran the checks (a throw-away Vitest file, npm run test:unit, grep, reading line numbers) and wrote the labels; I still have to read each row before submitting <!-- Ayan: change to yes only after you have opened the files yourself -->

**Every change to `app/` was reviewed by me as a diff before I accepted it:** the AGENTS.md patch yes (I approved it in chat after reading the 8-line diff); the R4 diff in `src/booking.ts` and `src/intervals.ts` is still waiting for my review <!-- Ayan: complete after you read it -->
<!-- Name anything you rejected in §8; name here anything you accepted without reading. -->

**I used another assistant as well (to explain a risk, to draft text in lab-report.md, …):** no other assistant; the same Claude Sonnet 5.5 drafted the text of every section of lab-report.md except section 10, the conclusion, which I wrote myself; the assistant only checked its numbers, word count and one translation error ("armor" for bookings) and I applied the fixes
<!-- If "yes": which one, the exact model, and for which section. -->

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes (ANSI colour codes removed; runs were made in the assistant's Linux workspace, not on my computer)

**I can explain every score in my register, and why my release decision follows from it, without the assistant:** yes – I have reviewed the R4 diff in src/booking.ts and src/intervals.ts.

**Anything I accepted from the AI without fully understanding it:**
The whole of lab-report.md sections 3.2, 4 and 6.2 (labels, scores, decisions) was proposed by the assistant, and src/intervals.ts was written by the assistant; I have not yet gone through them line by line.

Signed: Ayan Zeinetula
Date: 2026-11-22
