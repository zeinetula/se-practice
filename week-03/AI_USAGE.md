# AI Usage Log — Week 03

## AI Level Disclosure
**Level D: AI-Driven Development / Experimentation**
AI was used to generate user stories, acceptance criteria, and PlantUML use-case diagrams based on the provided scenario requirements.

## AI Tools Used
* **Tool / Model:** ChatGPT (GPT-4o)
* **Purpose:** Initial generation of requirements artifacts (user stories, Given-When-Then acceptance criteria, PlantUML diagram source).

## Summary of AI Interactions
1. **User Stories:** Generated 7 user stories based on verbatim prompt. Reviewed against out-of-scope constraints.
2. **Acceptance Criteria:** Generated 3-5 Given/When/Then criteria for US-01, US-02, and US-05 including happy path, boundary, and invalid/error cases.
3. **PlantUML Diagram:** Generated use-case diagram code with Student and Administrator actors.

## Verification & Reflection
* All outputs were thoroughly reviewed and edited to enforce strict adherence to out-of-scope guidelines (e.g., preventing payment, check-in, or notification creep).
* Fixed association rules in PlantUML to prevent direct human trigger lines to `UC-06: Send confirmation`.