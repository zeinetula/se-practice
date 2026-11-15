# AI Usage Disclosure — Week 09

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude (Anthropic), via Claude Code | Claude Sonnet (subagent), exact version not displayed | Part 2 — writing the calls for R1, R2, R3, one fresh session per request | calls/ (saved unedited) |
| Claude (Anthropic), via Claude Code | Claude Sonnet 5.5 (claude-sonnet-5-5) | Wrote tool/check_room.json; ran the checker; drafted lab-report.md sections 1-7 and 9 and filled submission.yml | tool/check_room.json, lab-report.md, submission.yml, AI_USAGE.md |

**I wrote `tool/check_room.json` myself:** no
The whole file was written by Claude. I checked it by running `python tests/check_tool.py`: D1-D6 and S01-S12 pass, and the first run (empty template, 9 of S01-S12 failing) is recorded in lab-report.md section 3.

**I used an AI to explain a JSON Schema keyword or a check:** no
<!-- If "yes": which one, and for what. -->

**Every reply in `calls/` and in lab-report.md section 4 is exactly what the model returned:** yes

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**Anything I accepted from the AI without fully understanding it:**
lab-report.md sections 2-7 and 9 were drafted by Claude, not by me; I must read them and be able to explain them. Section 10 (conclusion) is written by me without AI.

Signed: Ayan Zeinetula
Date: 2026-11-15
