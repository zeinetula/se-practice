# AI Usage Disclosure — SIS #03

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched | Reused from |
| --- | --- | --- | --- | --- |
| Claude.ai (Antigravity) | Claude Sonnet 4.6 (Thinking) | the plan (stage A) | report.md §11 B1 | this SIS |
| Claude.ai (Antigravity) | Claude Sonnet 4.6 (Thinking) | Python v1 (stage B) | `code/original/booking_v1.py` | this SIS |
| Bolt.new | not displayed | web prototype v1 (stage B) | `web/original/` | week-06 |
| Claude.ai (Antigravity) | Claude Sonnet 4.6 (Thinking) | critique (stage C) | report.md §8, §11 B3 | this SIS |
| Claude.ai (Antigravity) | Claude Sonnet 4.6 (Thinking) | repair (stage D) | `web/final/src/lib/availability.ts`, report.md §7, §11 B4 | this SIS |

**The assistant wrote, or helped write, my tests in `code/`:** yes
<!-- The test names and docstrings were AI-assisted. However, the expected values (True/False)
     were derived from AC1–AC5, not from what the generated code returns. For example,
     T1 is expected True because AC4 says touching endpoints are allowed — not because I ran
     the code and copied the output. I verified each expected value against the relevant AC
     before writing the assertEqual call. -->

**`code/original/` and `web/original/` hold the AI's first versions exactly as returned:** yes

**Every result in report.md section 5 was actually run or seen, not assumed:** yes

**Everything I submitted, I can explain and defend in class — including the overlap condition
and what the agent did in section 9:** yes

**Anything I accepted from the AI without fully understanding it:**
None. I reviewed every conditional branch in `booking.py` (section 3) and verified the
overlap condition `start < e and end > s` by hand before accepting.

Signed: Ayan Zeinetula
Date: 2026-11-01
