# Lab Report — Week 04: Modeling the System with UML

## 1. Environment & Setup
* **AI Assistant:** ChatGPT
* **Exact Model Name:** GPT-4o
* **Repository & Branch:** `se-practice` / `week-04`

---

## 2. Diagram Reviews & Findings

### Use Case Diagram Findings
* **Element:** `UC-06: Send confirmation`
* **Problem:** AI initially connected Student directly to `Send confirmation`.
* **Correction/Rule:** According to R4, confirmation is automatically triggered upon successful booking/cancellation. Replaced direct actor association with `<<include>>` relationships from `Book room` and `Cancel booking`.

### Class Diagram Findings
* **Element:** `Booking` class & `Room-Booking` association.
* **Problem:** AI placed multiplicity `1..*` on `Booking`, implying every room must have an active booking to exist.
* **Correction/Rule:** Corrected multiplicity to `0..*`. Moved rule R2 (max 2 hours) out of attributes and into a class note.

### Sequence Diagram Findings
* **Element:** Room availability and rule validation checks.
* **Problem:** AI created the `Booking` entity before validating rules R1 and R3.
* **Correction/Rule:** Moved validation calls to `BookingRepository` and `BookingService` prior to executing `saveBooking()`. Formatted `alt` guards without square brackets to follow PlantUML conventions.

---

## 3. Critique Prompt & Consistency Matrix

### Critique Results
1. **Issue:** Initial class diagram lacked explicit representation of room blocked status.
   * **Verdict:** Accepted. Added `isBlocked: boolean` attribute to `Room` class.
2. **Issue:** Sequence diagram missing explicit check for R4 room blocked state.
   * **Verdict:** Accepted. Added `isRoomBlocked(roomId)` call before overlap check.
3. **Issue:** Unjustified external notifications in initial use case drafts.
   * **Verdict:** Rejected. Maintained system boundary constraints as defined in Week 03 out-of-scope rules.

### Traceability & Consistency
* **R1 (Future start & duration <= 2h):** Enforced in Sequence Diagram validation step and Class Diagram note.
* **R2 (Duration <= 2h):** Represented in Class Diagram note and Sequence Diagram validation.
* **R3 (No overlap):** Verified via `hasOverlap()` call in Sequence Diagram and Class Diagram note.
* **R4 (Blocked room cannot be booked):** Checked via `isRoomBlocked()` in Sequence Diagram and `isBlocked` attribute in Class Diagram.

---

## 4. Change Log
* **use-case.puml:** Replaced direct actor association for UC-06 with `<<include>>` relationships. Added `'why:` comments.
* **class.puml:** Fixed `Room` to `Booking` multiplicity from `1..*` to `0..*`. Added domain notes for business rules R1–R4.
* **sequence.puml:** Reordered lifelines, moved entity creation after successful validation, formatted `alt` guards without brackets.