# AI Usage Disclosure — SIS #04

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Date | Used for | Which files it touched |
| --- | --- | --- | --- | --- |
| Claude.ai Project, Claude Code session | Claude Sonnet 5.5 (`claude-sonnet-5-5`) | 2026-11-22 | codebase analysis (Task 1) | read `week-07/app/src/*`, `sis-04/README.md`, `sis-04/tests/check_sis.py`; wrote report.md 2-3 |
| Claude.ai Project, Claude Code session | Claude Sonnet 5.5 (`claude-sonnet-5-5`) | 2026-11-22 | improvement plan | report.md 3.2-3.3 |
| Claude.ai Project, Claude Code session | Claude Sonnet 5.5 (`claude-sonnet-5-5`) | 2026-11-22 | feature extension (Task 2) | `app/src/rooms.ts`, `filter.ts`, `booking.ts`, `App.tsx`, screenshots in `evidence/` |
| Claude.ai Project, Claude Code session | Claude Sonnet 5.5 (`claude-sonnet-5-5`) | 2026-11-22 | refactoring (Task 3) | `app/src/booking.ts`, `App.tsx`, `components/*`, `lib/time.ts`, `lib/messages.ts`, `diagrams/*.puml` |
| Claude.ai Project, Claude Code session | Claude Sonnet 5.5 (`claude-sonnet-5-5`) | 2026-11-22 | tests (Task 4) | `app/src/filter.test.ts`, `room.test.ts`, `rejection.test.ts`; `app/README.md`; report.md 1, 4-9; `submission.yml` |

**The assistant wrote, or helped write, tests in `app/`:** yes
The assistant wrote `filter.test.ts`, `room.test.ts` and `rejection.test.ts`. Their expected values were written from the rules in the SIS #04 README (F1-F5, AC1-AC4, B1-B6) before the code existed; the red runs in report.md 6.2 show the tests failing first. The 23 tests in `booking.test.ts` are my Practice #07 tests, unchanged.

**Every run pasted in report.md was produced by my code on my machine (or Codespace), unedited:** yes — produced by my code, unedited, but in the assistant's cloud sandbox (Linux, Node v22.23.5), not on my own computer; report.md section 1 says so.

**Every number in report.md section 7 was measured the way its row says:** yes

**I shared no credentials, keys or private data with any tool:** yes

**Everything I submitted, I can explain and defend in class — including filterRooms, checkRoom and why each module exists:** yes

**Anything I accepted from the AI without fully understanding it:** nothing

Signed: Ayan Zeinetula
Date: 2026-11-22
