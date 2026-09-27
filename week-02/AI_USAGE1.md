# AI Usage Log — Week 02

## AI Level Disclosure
**Level D: AI-Driven Development / Experimentation**
AI was used as the subject of the experiment itself (prompt engineering evaluation) and as a tool to execute tasks according to the lab rules.

## AI Tools Used
* **Tool / Model:** ChatGPT (GPT-4o)
* **Purpose:** Generating Python function implementations for `analyze_marks` based on four different prompt structures (Prompt A, Prompt B, Prompt C, Prompt D), and assisting in structured lab reporting.

## Summary of AI Interactions
1. **Prompt A (Minimal):** Generated an arbitrary standalone script in ChatGPT (GPT-4o). Resulted in 0/6 tests passed due to missing the required function definition `analyze_marks`.
2. **Prompt B (Structured Context):** Generated `analyze_marks` with 5/6 tests passed, failing on Case 5 by raising `TypeError` instead of `ValueError`.
3. **Prompt C (Examples & Tests):** Generated `analyze_marks` with 6/6 tests passed after explicit test cases were provided in the context.
4. **Prompt D (Combined & Optimized):** Generated `analyze_marks` with 6/6 tests passed using a streamlined prompt that removed conversational noise and enforced unified exception behavior.

## Verification & Reflection
* All generated code was saved directly into `week-02/code/` without manual edits before running the test harness `tests/test_analyze_marks.py`.
* Results were verified purely through the provided test script output.