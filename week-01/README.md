# Week 01 — AI in Software Engineering: First Contact

**Course:** AI-Driven Software Engineering (Fall 2026, KBTU SITE)
**Practice work #01** · 1 point · AI-use level: **D (AI-integrated, disclosure required)**

---

## The idea of this lab

You will build the **same small program twice**:

1. **By hand**, with no AI at all.
2. **With an AI app builder** (Rocket), from a single natural-language prompt.

Then you will compare the two flows and write a short, honest reflection.

**Main message of this lab:** AI can speed up development, but the software engineer stays
responsible for correctness, testing, maintainability and security. This lab is your baseline —
in later weeks you will compare everything back to what happened here.

**Time budget:** ~50 min in class + ~40 min at home.

---

## Deliverables

By the deadline, your branch `week-01` must contain:

```
week-01/
├── manual/          # your hand-written solution + how to run it
├── ai/
│   ├── prompts.md   # every prompt you typed + Rocket's rewritten prompt
│   └── screenshots/ # at least 3 screenshots (see Part 2)
├── comparison.md    # filled-in comparison table + reflection
└── AI_USAGE.md      # AI disclosure (required by the course policy)
```

Templates for `comparison.md` and `AI_USAGE.md` are already in this folder. Fill them in — do not
delete the headings.

---

## Part 0 — Repository setup (once per course)

If you have not created your practice repository yet, follow **[SETUP.md](../SETUP.md)** first.
Short version:

```bash
git clone https://github.com/<your-username>/se-practice.git
cd se-practice
git checkout -b week-01
mkdir -p week-01/manual week-01/ai/screenshots
```

---

## Part 1 — Build it manually (no AI) — ~20 min

> **Rule:** no Copilot, no ChatGPT/Claude, no autocomplete-by-AI in this part. Standard library,
> documentation and your own head only. If your IDE has an AI assistant, turn it off now. This part
> is not graded on elegance — it is graded on being *yours*.

### Specification

Write a program that takes a list of student marks and prints:

| Output | Format |
| --- | --- |
| Number of valid marks | integer |
| Average | 2 decimals |
| Highest | as given |
| Lowest | as given |
| Pass rate | percentage, 1 decimal |

Rules:

- A **valid mark** is a number from **0 to 100 inclusive**. Anything else (text, empty value,
  `-5`, `101`) is **ignored** — the program must not crash.
- A mark **passes** if it is **≥ 50** (KBTU grade D starts at 50%).
- Pass rate = passing marks ÷ valid marks × 100.
- If there are **no valid marks**, print a clear message instead of statistics — no crash, no
  division by zero.

Input: hard-code the list, read it from `marks.txt`, or read it from the console — your choice.
Language: any language you can run and explain. Python is the easiest here.

### Test data — your program must produce exactly this

| # | Input | Valid | Average | Highest | Lowest | Pass rate |
| --- | --- | --- | --- | --- | --- | --- |
| A | `85, 23, 45, 90, 92` | 5 | 67.00 | 92 | 23 | 60.0% |
| B | `88, 47, -5, 101, abc, 73, 50, , 100` | 5 | 71.60 | 100 | 47 | 80.0% |
| C | `10, 20, 30` | 3 | 20.00 | 30 | 10 | 0.0% |
| D | `abc, , xyz` | 0 | — | — | — | message, no crash |

Run all four cases before you continue. **Case B and case D are where most solutions break** —
that is the point.

### Record your time

Write down, in `comparison.md`:

- minutes until your **first version ran** at all;
- minutes until **all four cases passed**;
- which case broke your first version.

Commit:

```bash
git add week-01/manual
git commit -m "week-01: manual solution for marks statistics"
```

---

## Part 2 — Build it with Rocket — ~15 min

**Tool:** [rocket.new](https://www.rocket.new/) — an AI app builder ("vibe solutioning" platform).
Register with your email; the free tier is enough for this lab. Use the **web** version, not the
mobile app — code download and screenshots are web-only features.

### Steps

1. **Start a new project.** In the prompt box, paste **exactly this**, and nothing else:

   ```
   Build a small program that processes a list of student marks and prints:
   average, highest, lowest, and pass rate.
   ```

   Do **not** add your rules from Part 1 yet. We want to see what the tool does with a vague,
   realistic, one-line request.

2. **Screenshot #1** — the prompt and Rocket's first reaction. Rocket scores prompt completeness
   and may refuse to build until the score is high enough; it will ask you clarifying questions.
   **Write down every question it asks** in `ai/prompts.md`. Those questions are requirements
   engineering — Lesson 03 of this course.

3. **Answer the questions**, then **screenshot #2** — Rocket's *rewritten / enhanced* prompt.
   Copy that rewritten prompt into `ai/prompts.md` word for word. Note what the tool **added by
   itself** that you never asked for (a tech stack, a UI, a threshold, extra features).

4. **Let it build**, then open the preview. **Screenshot #3** — the running app with test data.

5. **Test it with the same four cases from Part 1.** For each case write down in `ai/prompts.md`:
   the input, what the app printed, and whether it matches the specification.

6. **Fix one defect with a follow-up prompt.** Pick the worst wrong behaviour you found, ask
   Rocket to fix it, and record the prompt and the result. Did the fix work? Did it break
   something else?

7. If Rocket lets you **download the code**, put it in `week-01/ai/`. If not, screenshots plus the
   published/preview link are enough — say so in `comparison.md`.

> **Do not commit any API key, token or password.** If a generated file contains one, delete the
> value before committing.

Commit:

```bash
git add week-01/ai
git commit -m "week-01: Rocket prompt log, screenshots and test results"
```

---

## Part 3 — Compare and reflect — ~20 min

Open `comparison.md` and fill in every row of the table, then answer the four reflection
questions in 200–300 words total.

Be specific. "AI was faster" is worth nothing. "AI produced a running UI in 4 minutes but silently
accepted 101 as a valid mark, and case D showed NaN" is worth everything.

Then fill in `AI_USAGE.md`. Disclosure is mandatory in this course — an undisclosed AI tool is an
academic-integrity problem, not a style problem.

Commit:

```bash
git add week-01/comparison.md week-01/AI_USAGE.md
git commit -m "week-01: comparison and reflection"
```

---

## Part 4 — Submit

```bash
git push -u origin week-01
```

Then on GitHub:

1. Open a **Pull Request** from `week-01` into `main` **in your own repository**.
2. Title: `Week 01 — AI in Software Engineering: First Contact`
3. In the PR description answer three lines: *what I built*, *what the AI got wrong*,
   *how long each version took*.
4. **Do not merge it.** Leave the PR open — that is how it gets reviewed.
5. Paste the **PR link** into the Week 01 assignment on **MS Teams**.

A PR link that is already merged, or a link to the repository instead of the PR, counts as not
submitted.

---

## Grading (1 point)

| Criterion | Points |
| --- | --- |
| Manual solution runs and handles all four test cases | 0.25 |
| Rocket attempt documented: prompt log, rewritten prompt, 3+ screenshots, test results | 0.25 |
| `comparison.md` complete — table filled + specific, honest reflection | 0.25 |
| Workflow correct: `week-01` branch, ≥3 commits, open PR, link in Teams, `AI_USAGE.md` present | 0.25 |

**Not accepted:** merged or empty PR · committing straight to `main` · a manual part that is
obviously AI-generated · a reflection with no concrete example · a missing AI disclosure.

Late submissions follow the general course policy — see the syllabus.

---

## Frequently hit problems

- **"Rocket won't build, my prompt score is too low."** Good — that is the lesson. Answer its
  questions and record them. The tool is doing requirements elicitation for you.
- **"Rocket built a full web app, my manual version is a console script."** That is expected and
  it is one of the comparison rows: the AI chose a stack and a scope you never asked for.
- **"The AI version is better than mine."** Then say so and explain why, precisely. Honest
  reflection scores higher than defensive reflection.
- **"I can't verify what the AI generated."** Write that down too — it is the most important
  finding you can make in Week 1.
