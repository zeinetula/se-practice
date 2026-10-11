# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:** Ayan
**Group:** Undergraduate (SE)
**Date:** 2026-09-20

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them
> by number. If something did not happen, write "did not happen" and why; an empty section and a
> fabricated one are graded the same way.

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant | ChatGPT |
| Exact model name | GPT-4o |
| Implementation language | Python |
| Date of the runs | 2026-09-20 |

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:

n/a — used Python


**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes
- No follow-up questions were asked before Part 7: yes
- Every output was saved **before** any editing: yes

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

Write Python code to analyze student marks. Nothing else.


**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass
threshold, a rounding rule, an input method, an invented feature all count.

1. Assumed marks should be hardcoded in a sample list directly in the script instead of writing a reusable function.
2. Assumed a default hardcoded pass threshold of 60 instead of 50.
3. Assumed counting the number of passed/failed students was required rather than calculating a pass rate percentage.
4. Assumed console output via `print()` was the intended interface.

**Questions it should have asked and did not:**

1. What is the expected function name, input signature, and data structure for the return value?
2. What are the pass threshold and input validation requirements for empty or invalid data?

**Is the function named `analyze_marks` with the required signature?** no — created a top-level executable script with no function definition.

**First impression before testing**: The code is just a standalone script printing sample stats to the console and will fail the test harness due to missing the target function `analyze_marks`.

---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

You are a Python developer writing utility functions for an educational platform.
Write a function named analyze_marks(marks, pass_mark=50) that takes a list of numeric marks (0 to 100) and returns a dictionary with keys: average, highest, lowest, and pass_rate (percentage of marks >= pass_mark, rounded to 2 decimal places or raw float).

Validation rules:

If marks is empty, raise ValueError.

If any element in marks is not an int or float, raise TypeError or ValueError.

If any mark is less than 0 or greater than 100, raise ValueError.

If pass_mark is not between 0 and 100, raise ValueError.

Constraints:

Do not import external libraries.

Return only the function definition.


**What B fixed compared to A:**

1. Defined the exact function signature `analyze_marks(marks, pass_mark=50)` and dictionary structure for output.
2. Added explicit validation rules for empty inputs, out-of-range values, and parameter types.

**What B still leaves open:**

1. Ambiguity in exception choice for non-numeric types (`raise TypeError or ValueError`), allowing the AI to pick `TypeError`.
2. Lack of concrete test cases or examples to verify edge case handling before generating code.

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**

Example:
analyze_marks([40, 60, 80], 50) -> {'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 66.67}

Required tests to satisfy:

Normal list: analyze_marks([40, 60, 80], 50)

Single element: analyze_marks([100], 50)

Float marks: analyze_marks([49.5, 50], 50)

Empty list: analyze_marks([], 50) -> raises ValueError

Non-numeric value: analyze_marks([40, '60'], 50) -> raises ValueError

Out-of-range mark: analyze_marks([-1, 50, 101], 50) -> raises ValueError


**Tests the AI wrote for itself** — how many, and which situations do they cover?

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | yes |
| decimals | yes |
| custom pass_mark | yes |
| empty list | yes |
| text value | yes |
| below 0 / above 100 | yes |

**Do the AI's own tests pass against the AI's own code?** yes

**Do they agree with the harness in section 6?** yes

**Assumptions C stated explicitly before the code:** Stated that all invalid inputs (empty lists, non-numeric elements, out-of-range marks) must strictly raise `ValueError` as specified in the test cases list.

---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

Write a Python function analyze_marks(marks, pass_mark=50) that analyzes a list of student marks (0 to 100) without external libraries.

Returns a dictionary with:

'average': sum of marks divided by count

'highest': maximum mark

'lowest': minimum mark

'pass_rate': percentage of marks >= pass_mark (0 to 100)

Validation (must raise ValueError for ALL invalid inputs):

Empty marks list

Any element in marks is not an int or float (e.g. string, None)

Any mark is < 0 or > 100

pass_mark is < 0 or > 100

Return only the pure Python function definition.


**What I deliberately added that A, B and C did not have:**

1. Explicit unified error directive forcing `ValueError` for ALL invalid inputs (eliminating `TypeError` ambiguity).
2. Bulleted concise contract mapping requirements directly to dictionary key names without narrative filler.
3. Explicit check requirements for `None` and string values under element type validation.

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**

The prompt specification in B permitted either `TypeError` or `ValueError` for non-numeric items ("raise TypeError or ValueError"). The harness specifically expected `ValueError` for string inputs like `'60'`. In Prompt D, I resolved this by explicitly dictating: "must raise ValueError for ALL invalid inputs".

---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | PASS | PASS | PASS |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR | PASS | PASS | PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | PASS | PASS | PASS |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR | ERROR | PASS | PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| | **Totals** | | 0/6 | 5/6 | 6/6 | 6/6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| A | 1–6 | Module level code ran; no function named `analyze_marks` defined |
| B | 5 | Raised `TypeError: marks must contain only numbers` instead of `ValueError` |

### Pasted terminal output — all four runs

**Prompt A**

Marks: [85, 72, 90, 65, 78, 95, 88, 60, 74, 92]
Average: 79.9
Highest: 95
Lowest: 60
Passed: 10
Failed: 0
ERROR: week-02\code\prompt_a.py defines no callable named 'analyze_marks'.
All six cases count as ERROR. Record that in lab-report.md.


**Prompt B**

========================================================================
analyze_marks harness — week-02/code/prompt_b.py
tolerance for numeric comparison: 0.01
SIGNATURE: ok
case 1   PASS   analyze_marks([40, 60, 80], 50)
expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
case 2   PASS   analyze_marks([100], 50)
expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
case 3   PASS   analyze_marks([49.5, 50], 50)
expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
case 4   PASS   analyze_marks([], 50)
expect: ValueError
got   : raised ValueError: marks cannot be empty
case 5   ERROR  analyze_marks([40, '60'], 50)
expect: ValueError
got   : raised TypeError instead of ValueError: marks must contain only numbers
case 6   PASS   analyze_marks([-1, 50, 101], 50)
expect: ValueError
got   : raised ValueError: marks must be between 0 and 100
RESULT  5 PASS · 0 FAIL · 1 ERROR   (week-02/code/prompt_b.py)

**Prompt C**

========================================================================
analyze_marks harness — week-02/code/prompt_c.py
tolerance for numeric comparison: 0.01
SIGNATURE: ok
case 1   PASS   analyze_marks([40, 60, 80], 50)
expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
case 2   PASS   analyze_marks([100], 50)
expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
case 3   PASS   analyze_marks([49.5, 50], 50)
expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
case 4   PASS   analyze_marks([], 50)
expect: ValueError
got   : raised ValueError: marks cannot be empty
case 5   PASS   analyze_marks([40, '60'], 50)
expect: ValueError
got   : raised ValueError: all marks must be numeric
case 6   PASS   analyze_marks([-1, 50, 101], 50)
expect: ValueError
got   : raised ValueError: marks must be between 0 and 100
RESULT  6 PASS · 0 FAIL · 0 ERROR   (week-02/code/prompt_c.py)

**Prompt D**

========================================================================
analyze_marks harness — week-02/code/prompt_d.py
tolerance for numeric comparison: 0.01
SIGNATURE: ok
case 1   PASS   analyze_marks([40, 60, 80], 50)
expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
got   : average=60.0, highest=80, lowest=40, pass_rate=66.66666666666666
case 2   PASS   analyze_marks([100], 50)
expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
case 3   PASS   analyze_marks([49.5, 50], 50)
expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
case 4   PASS   analyze_marks([], 50)
expect: ValueError
got   : raised ValueError: marks must not be empty
case 5   PASS   analyze_marks([40, '60'], 50)
expect: ValueError
got   : raised ValueError: invalid mark
case 6   PASS   analyze_marks([-1, 50, 101], 50)
expect: ValueError
got   : raised ValueError: mark must be between 0 and 100
RESULT  6 PASS · 0 FAIL · 0 ERROR   (week-02/code/prompt_d.py)

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | 0 | 1 | 2 | 2 |
| Requirement coverage | 0 | 2 | 2 | 2 |
| Verifiability (tests) | 0 | 0 | 2 | 2 |
| Assumptions stated | 0 | 1 | 2 | 2 |
| Noise (2 = none) | 2 | 1 | 1 | 2 |
| **Total / 10** | **2** | **5** | **9** | **10** |

**Prompt length, in words:** A 9 · B 103 · C 185 · D 76

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:
B gained 3 points for 94 words (31.3 words/pt); C gained 4 points over B for 82 words (20.5 words/pt); D reached perfect score (10/10) while removing 109 words compared to C, showing that precision and clarity matter more than raw verbosity.

---

## 8. Conclusion — 150–200 words

Prompt D scored best (10/10, 6/6 test pass) and is the exact concise version I would use in production. Prompt A completely failed (0/6 pass) because it defined no function named `analyze_marks`. Prompt B improved significantly (5/6 pass) but failed Case 5 (`analyze_marks([40, '60'], 50)`), returning `TypeError: marks must contain only numbers` instead of `ValueError`. 

The single addition that bought the most correctness was providing test expectations in Prompt C and enforcing a strict exception directive in Prompt D ("must raise ValueError for ALL invalid inputs"), which changed Case 5's verdict from ERROR to PASS. 

The fluff role setup in B ("You are a Python developer writing utility functions...") was pure noise that added no functional value. The primary ambiguity was the spec permitting either `TypeError` or `ValueError` for non-numeric types; resolving this in Prompt D by mandating `ValueError` across all validation failures eliminated runtime discrepancies and achieved full correctness with minimal prompt length.

**Word count:** 168

---

## 9. Two questions for the debrief

1. When a test harness expects a specific exception type (like `ValueError`), how can we best structure prompts to prevent models from defaulting to idiomatic language types (like Python's `TypeError`)?
2. Is it better practice in production to provide explicit test cases inside the prompt (like Prompt C) or to use concise constraint rules (like Prompt D)?