# SIS #02 — AI-Assisted UML Modeling: University Course Registration

<!--
  This is the only file you write your report in. README.md tells you what goes where.

  Rules the checker relies on:
  - Do not delete, rename or renumber the ## headings, the ### headings, or the **Label:** words.
  - Replace every "(write here)" and "(paste here)". None may be left when you submit.
  - Comments like this one are ignored by the checker and the word counter. Delete them or leave them.
-->

## 1. Scope and assumptions

<!-- Your FINAL scope statement and assumptions, after reviewing Prompt A's output. Say here
     what is out of scope (payments, prerequisites, timetable clashes, waiting lists,
     cancellation) — section 2 must not mention them. Section 10 keeps your first version. -->

**Scope:** The system lets signed-in students browse one semester's course offerings and request registration for a specific offering, returning confirmation or a rule-based rejection. Payments, prerequisites, timetable clashes, waiting lists, and cancellation are outside this system's scope.

**Assumptions:**

1. Students are already signed in; their active session identifies the student.
2. The selected offering exists, and its capacity is a positive whole number.

## 2. User stories and acceptance criteria

<!-- Your APPROVED requirements: Prompt A's draft after your review. Keep the IDs, the three
     story headings and the bullet shape. Every criterion names the rule(s) it maps to,
     e.g. (R2, R4). Two criteria per story. Nothing out of scope.
     Format of a criterion, on one bullet:
     - **AC-03** (R2, R4): Given ..., When ..., Then ... -->

### US-01 — Browse offerings

**US-01:** (write here — As a student, I want …, so that …)

- **AC-01** (R?): (write here — Given …, When …, Then …)
- **AC-02** (R?): (write here)

### US-02 — Register for an offering

**US-02:** (write here)

- **AC-03** (R?): (write here)
- **AC-04** (R?): (write here)

### US-03 — Receive a clear rejection

**US-03:** (write here)

- **AC-05** (R?): (write here)
- **AC-06** (R?): (write here)

## 3. Sequence diagram

<!-- The FINAL diagram, rendered. Change .png to .svg if that is what you exported. -->

![Final sequence diagram](models/img/sequence.png)

**Participants:** (write here — each lifeline and what it stands for)

**Atomic operation:** (write here — which messages form the one atomic step: the final duplicate check, the capacity check and the creation of the Enrollment, and why a catalog view reserves nothing)

**Where the Enrollment is created:** (write here — which message, which lifeline, and which class in section 4 it produces)

**Technical lifelines:** (write here — every lifeline that is NOT a class in the class diagram, by name, and why the difference in abstraction is fine. "None" if there are none.)

## 4. Class diagram

<!-- The FINAL diagram, rendered. -->

![Final class diagram](models/img/classes.png)

<!-- One row per association in classes.puml, read in both directions. -->

| Association | Read left to right | Read right to left |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

**How an Enrollment links a student to an offering:** (write here)

**Capacity constraint:** (write here — and why multiplicity alone cannot express it)

**Uniqueness constraint:** (write here — and why multiplicity alone cannot express it)

## 5. Traceability

<!-- Every rule, including the catalog fields and availability (R1). Column 1: the rule and
     the criteria that cover it, e.g. "R2 + AC-03, AC-04". Column 2: the message, guard,
     class or constraint that shows the rule in YOUR diagrams. Column 3: the T-ID that
     exercises it, or the extra check you did instead (R1 has no T case). -->

| Rule and criterion | Model evidence | Validation case |
| --- | --- | --- |
| R1 + (write here) | (write here) | (write here) |
| R2 + (write here) | (write here) | (write here) |
| R3 + (write here) | (write here) | (write here) |
| R4 + (write here) | (write here) | (write here) |
| R5 + (write here) | (write here) | (write here) |

## 6. Walkthroughs

<!-- Walk each case through YOUR final sequence diagram, message by message. Column 2: the
     actual steps and the state change (count before → after). Column 3 starts with Pass or
     Fail, then the location: the message, guard or note where you saw it. A Fail you
     report honestly is a finding, not a penalty. -->

| Case | Observed path and state change | Judgment and evidence |
| --- | --- | --- |
| T1. Available | (write here) | (write here) |
| T2. Last place | (write here) | (write here) |
| T3. Full | (write here) | (write here) |
| T4. Duplicate | (write here) | (write here) |

## 7. Review decisions

<!-- At least three substantive decisions about Prompt C's critique or your own inspection.
     Decision: accepted / rejected / modified — and what you did. Reason: why, in a full
     sentence. Rule: R1–R5. Do not invent an error to fill the table; a justified rejection
     of advice counts. -->

| AI suggestion or model element | Decision | Reason | Rule |
| --- | --- | --- | --- |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |

## 8. Modeling explanation

<!-- 200–300 words. Your main design choices; how the class diagram and the sequence diagram
     complement each other; why an activity diagram could also help explain the workflow. -->

(write here)

## 9. Reflection

<!-- 150–200 words. Written by you, not by the assistant: where AI helped, one decision you
     made yourself, one remaining limitation. Specific beats flattering. -->

(write here)

## 10. Appendix A — Before AI

<!-- Written BEFORE you run Prompt A, committed and pushed in your first commit, and never
     edited afterwards. This is what you paste into Prompt A as "My initial assumptions". -->

**Scope:** The system allows authenticated students to view course availability, select specific course offerings, and attempt registration, handling both successful enrollments and rejections due to capacity limits or duplicate requests, while excluding payment processing, prerequisite validation, schedule conflict checking, and waitlists.

**Initial assumptions:**

1. **Assumption 1 (Authentication & Session State):** The student is already securely authenticated in the system, and their active session provides a valid student ID to the registration process without requiring re-authentication.
2. **Assumption 2 (Offering Existence & Positive Capacity):** The target course offering exists in the electronic catalog, and its maximum capacity is defined as a positive whole number greater than zero.
3. **Assumption 3 (Atomicity of Enrollment):** Capacity re-checking and enrollment creation are executed as a single atomic operation to prevent race conditions when multiple students request the last available seat simultaneously.

## 11. Appendix B — AI exchanges

<!-- Complete prompts and complete responses, as text — never screenshots. Paste each inside
     the ~~~~ block that follows its label: AI responses contain ``` PlantUML blocks, and
     ~~~~ keeps them from breaking this file. Prompts B and C: the prompt text first, then
     the material it refers to ("below", "these two") pasted under it, in the same block.
     You may add B5, B6 … after B4 if you ran more. -->

### B1 — Requirements (Prompt A)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** draft 3 user stories and 6 acceptance criteria

<!-- Model: the exact model with its version, as the tool shows it (e.g. "GPT-5 Thinking",
     "Claude Sonnet 4.5"). If the tool does not show it, write: not displayed
     Date: YYYY-MM-DD -->

**Prompt:**

~~~~text
Act as a requirements analyst. Use only this course registration scenario and rules R1–R5: A student browses an electronic course catalog, chooses a course offering and requests registration. Each offering has a limited number of places.

A Course describes a subject. A CourseOffering is one scheduled section in one semester. Registration always targets a specific offering.

Assume that the student is signed in, the selected offering exists, and its capacity is a positive whole number.

Exclude payments, prerequisites, timetable clashes, waiting lists and cancellation. Use fictional students and courses.

R1. Catalog: Show the course code, title, offering and available places for one semester.
R2. Capacity: Recheck current availability when registering. Enrollment must never exceed the offering's capacity.
R3. Duplicates: A student may have at most one enrollment in the same offering. Reject a repeat request.
R4. Success: Create exactly one Enrollment linking the student and offering, update availability and return a confirmation.
R5. Rejection: Explain "course full" or "already enrolled". Create no enrollment and leave the enrollment count unchanged.

My initial assumptions are 1. The student is already securely authenticated in the system, and their active session provides a valid student ID to the registration process without requiring re-authentication. 2. The target course offering exists in the electronic catalog, and its maximum capacity is defined as a positive whole number greater than zero. 3. Capacity re-checking and enrollment creation are executed as a single atomic operation to prevent race conditions when multiple students request the last available seat.
Draft 3 user stories and 2 Given / When / Then acceptance criteria for each. Use IDs US-01 to US-03 and AC-01 to AC-06. Map each criterion to rule IDs.
Cover normal and rejection behavior. List uncertainty separately. Do not add excluded features or invent university policies.
~~~~

**Response:**

~~~~text
### US-01 — Browse offerings

**US-01:** As a student, I want to browse the course offerings for one semester, so that I can choose a specific offering to request.

- **AC-01 (R1):** Given the student is viewing the catalog for one semester, When the catalog is displayed, Then each offering shows its course code, title, offering, and available places.
- **AC-02 (R1):** Given the catalog contains offerings for the selected semester, When the student chooses an offering, Then the chosen item is a specific CourseOffering in that semester.

### US-02 — Register for an offering

**US-02:** As a student, I want to request registration in a specific offering, so that my place is recorded when capacity allows.

- **AC-03 (R2, R4):** Given I am not enrolled and the offering has a place at registration time, When I request registration, Then exactly one Enrollment linking me to that offering is created, availability is updated, and confirmation is returned.
- **AC-04 (R2, R4):** Given exactly one place remains and I am not enrolled, When I request registration, Then the request succeeds and the resulting enrollment count equals, but does not exceed, capacity.

### US-03 — Receive a clear rejection

**US-03:** As a student, I want a clear reason when registration is rejected, so that I know whether the offering is full or I am already enrolled.

- **AC-05 (R2, R5):** Given the catalog showed a place but the offering is full when registration is processed, When I request registration, Then the system explains "course full", creates no Enrollment, and leaves the enrollment count unchanged.
- **AC-06 (R3, R5):** Given I am already enrolled in the same offering, When I request registration again, Then the system explains "already enrolled", creates no Enrollment, and leaves the enrollment count unchanged.

**Uncertainty:** The rules do not prescribe catalog filtering or sorting, confirmation wording, or implementation technology. Those details are left unspecified rather than treated as additional policy.
~~~~

### B2 — UML drafts (Prompt B)

- **Tool:** GitHub Copilot in VS Code
- **Model:** not displayed
- **Date:** 2026-10-18
- **Purpose:** draft the sequence and class diagrams

**Prompt:**

~~~~text
Using my approved scenario, R1–R5, stories and criteria below, return separate PlantUML code blocks for a sequence diagram and a domain class diagram.
Sequence: include catalog browsing and guarded success, full-course and duplicate outcomes. Model final checks and creation as one atomic operation.
Class: show domain concepts, useful attributes and multiplicities. State the capacity and uniqueness constraints. Explain assumptions and any technical lifelines.

### US-01 — Browse offerings

**US-01:** As a student, I want to browse the course offerings for one semester, so that I can choose a specific offering to request.

- **AC-01 (R1):** Given the student is viewing the catalog for one semester, When the catalog is displayed, Then each offering shows its course code, title, offering, and available places.
- **AC-02 (R1):** Given the catalog contains offerings for the selected semester, When the student chooses an offering, Then the chosen item is a specific CourseOffering in that semester.

### US-02 — Register for an offering

**US-02:** As a student, I want to request registration in a specific offering, so that my place is recorded when capacity allows.

- **AC-03 (R2, R4):** Given I am not enrolled and the offering has a place at registration time, When I request registration, Then exactly one Enrollment linking me to that offering is created, availability is updated, and confirmation is returned.
- **AC-04 (R2, R4):** Given exactly one place remains and I am not enrolled, When I request registration, Then the request succeeds and the resulting enrollment count equals, but does not exceed, capacity.

### US-03 — Receive a clear rejection

**US-03:** As a student, I want a clear reason when registration is rejected, so that I know whether the offering is full or I am already enrolled.

- **AC-05 (R2, R5):** Given the catalog showed a place but the offering is full when registration is processed, When I request registration, Then the system explains "course full", creates no Enrollment, and leaves the enrollment count unchanged.
- **AC-06 (R3, R5):** Given I am already enrolled in the same offering, When I request registration again, Then the system explains "already enrolled", creates no Enrollment, and leaves the enrollment count unchanged.
~~~~

**Response:**

~~~~text
The sequence diagram separates browsing from registration. The catalog response includes the required course code, title, offering and available-place information, while the later registration request is handled by RegistrationService. EnrollmentRepository represents the persistence boundary where current facts can be checked rather than trusting the earlier catalog view.

The atomic group contains the duplicate check, current capacity check, and conditional creation/update. The alternatives are mutually exclusive: already enrolled, course full, or not enrolled with places left. Only the final branch creates an Enrollment, updates available places, and returns confirmation. Rejections return their reasons without a write.

The class diagram uses Student, Course, CourseOffering and Enrollment. CourseOffering carries its semester and capacity; availablePlaces is maintained when an enrollment is created. Each Enrollment connects one Student and one CourseOffering, while each Course may have zero or more offerings. The notes state the capacity and uniqueness rules because simple association multiplicities cannot express either constraint.

The technical lifelines CatalogUI, CatalogService, RegistrationService and EnrollmentRepository describe interaction and storage responsibilities; they are not domain classes. Assumptions are that a student is already identified, the offering exists, and capacity is positive, as stated in the scenario. The sequence models a single transaction-like atomic operation and does not prescribe a database or concurrency implementation. The constraints refer to the same offering and semester throughout, and no additional policy is introduced.

```plantuml
@startuml
title Course registration — initial sequence

actor Student
boundary CatalogUI
control CatalogService
control RegistrationService
database EnrollmentRepository

Student -> CatalogUI: browse catalog for semester
CatalogUI -> CatalogService: list offerings for semester
CatalogService --> CatalogUI: offerings with course code, title, offering, available places
CatalogUI --> Student: display catalog
Student -> CatalogUI: select CourseOffering
Student -> CatalogUI: register for selected offering
CatalogUI -> RegistrationService: register Student in CourseOffering

group atomic registration: final checks and enrollment creation
  RegistrationService -> EnrollmentRepository: begin registration transaction
  EnrollmentRepository -> EnrollmentRepository: check duplicate enrollment
  EnrollmentRepository -> EnrollmentRepository: check current count against capacity
  alt already enrolled
    EnrollmentRepository --> RegistrationService: already enrolled
    RegistrationService --> CatalogUI: reject already enrolled
    CatalogUI --> Student: show reason already enrolled
  else course full
    EnrollmentRepository --> RegistrationService: course full
    RegistrationService --> CatalogUI: reject course full
    CatalogUI --> Student: show reason course full
  else not enrolled and places left
    EnrollmentRepository -> EnrollmentRepository: create Enrollment
    EnrollmentRepository -> EnrollmentRepository: update available places
    EnrollmentRepository --> RegistrationService: enrollment created
    RegistrationService --> CatalogUI: confirm registration
    CatalogUI --> Student: show confirmation
  end
end

note over RegistrationService, EnrollmentRepository
  The atomic operation includes both final checks and creation.
  A catalog view does not reserve a place. Rejection branches only read
  state and return a reason; they do not change the enrollment count.
end note
@enduml
```

```plantuml
@startuml
title Course registration — initial domain classes

class Student {
  studentId: String
  name: String
}

class Course {
  courseCode: String
  title: String
}

class CourseOffering {
  offeringId: String
  semester: String
  capacity: Integer
  availablePlaces: Integer
}

class Enrollment {
  enrollmentId: String
  createdAt: DateTime
}

Student "1" -- "0..*" Enrollment : has >
CourseOffering "1" -- "0..*" Enrollment : receives >
Course "1" -- "0..*" CourseOffering : offers >

note "Capacity (R2): enrollmentCount <= capacity; availablePlaces = capacity - enrollmentCount. Update availability only when an Enrollment is created." as CapacityRule
CapacityRule .. CourseOffering
note "Uniqueness (R3): {studentId, offeringId} is unique. A repeated request creates no Enrollment." as UniqueRule
UniqueRule .. Enrollment
@enduml
```
~~~~

### B3 — Model critique (Prompt C)

- **Tool:** GitHub Copilot in VS Code (new chat)
- **Model:** not displayed
- **Date:** 2026-10-18
- **Purpose:** review both models against R1–R5 and T1–T4

**Prompt:**

~~~~text
Review these two UML models against R1–R5 and my acceptance criteria. Check message order, guards, state changes, multiplicities and naming.
Inspect the four validation cases: available places, exactly one place, full course after a stale catalog view, and duplicate registration.
For each issue, cite the affected rule and model element. Explain the impact and propose a focused correction. Separate genuine defects from optional design choices.

Approved acceptance criteria:
- AC-01 (R1): Given the student is viewing the catalog for one semester, When the catalog is displayed, Then each offering shows its course code, title, offering, and available places.
- AC-02 (R1): Given the catalog contains offerings for the selected semester, When the student chooses an offering, Then the chosen item is a specific CourseOffering in that semester.
- AC-03 (R2, R4): Given I am not enrolled and the offering has a place at registration time, When I request registration, Then exactly one Enrollment linking me to that offering is created, availability is updated, and confirmation is returned.
- AC-04 (R2, R4): Given exactly one place remains and I am not enrolled, When I request registration, Then the request succeeds and the resulting enrollment count equals, but does not exceed, capacity.
- AC-05 (R2, R5): Given the catalog showed a place but the offering is full when registration is processed, When I request registration, Then the system explains "course full", creates no Enrollment, and leaves the enrollment count unchanged.
- AC-06 (R3, R5): Given I am already enrolled in the same offering, When I request registration again, Then the system explains "already enrolled", creates no Enrollment, and leaves the enrollment count unchanged.

Original sequence.puml:
```plantuml
@startuml
title Course registration — initial sequence

actor Student
boundary CatalogUI
control CatalogService
control RegistrationService
database EnrollmentRepository

Student -> CatalogUI: browse catalog for semester
CatalogUI -> CatalogService: list offerings for semester
CatalogService --> CatalogUI: offerings with course code, title, offering, available places
CatalogUI --> Student: display catalog
Student -> CatalogUI: select CourseOffering
Student -> CatalogUI: register for selected offering
CatalogUI -> RegistrationService: register Student in CourseOffering

group atomic registration: final checks and enrollment creation
  RegistrationService -> EnrollmentRepository: begin registration transaction
  EnrollmentRepository -> EnrollmentRepository: check duplicate enrollment
  EnrollmentRepository -> EnrollmentRepository: check current count against capacity
  alt already enrolled
    EnrollmentRepository --> RegistrationService: already enrolled
    RegistrationService --> CatalogUI: reject already enrolled
    CatalogUI --> Student: show reason already enrolled
  else course full
    EnrollmentRepository --> RegistrationService: course full
    RegistrationService --> CatalogUI: reject course full
    CatalogUI --> Student: show reason course full
  else not enrolled and places left
    EnrollmentRepository -> EnrollmentRepository: create Enrollment
    EnrollmentRepository -> EnrollmentRepository: update available places
    EnrollmentRepository --> RegistrationService: enrollment created
    RegistrationService --> CatalogUI: confirm registration
    CatalogUI --> Student: show confirmation
  end
end

note over RegistrationService, EnrollmentRepository
  The atomic operation includes both final checks and creation.
  A catalog view does not reserve a place. Rejection branches only read
  state and return a reason; they do not change the enrollment count.
end note
@enduml
```

Original classes.puml:
```plantuml
@startuml
title Course registration — initial domain classes

class Student {
  studentId: String
  name: String
}

class Course {
  courseCode: String
  title: String
}

class CourseOffering {
  offeringId: String
  semester: String
  capacity: Integer
  availablePlaces: Integer
}

class Enrollment {
  enrollmentId: String
  createdAt: DateTime
}

Student "1" -- "0..*" Enrollment : has >
CourseOffering "1" -- "0..*" Enrollment : receives >
Course "1" -- "0..*" CourseOffering : offers >

note "Capacity (R2): enrollmentCount <= capacity; availablePlaces = capacity - enrollmentCount. Update availability only when an Enrollment is created." as CapacityRule
CapacityRule .. CourseOffering
note "Uniqueness (R3): {studentId, offeringId} is unique. A repeated request creates no Enrollment." as UniqueRule
UniqueRule .. Enrollment
@enduml
```
~~~~

**Response:**

~~~~text
## Blocking issues

None. The sequence and class models cover the four requested cases at a conceptual level, and the class multiplicities are consistent with an Enrollment linking one Student to one CourseOffering.

## Non-blocking issues

1. The branch conditions do not make the capacity boundary explicit. Affected rules: R2/R5; AC-03, AC-04, AC-05. Model element: the sequence alternatives "course full" and "not enrolled and places left." The labels imply outcomes but do not define the conditions against current state, including the exactly-one-place boundary. Focused correction: state conditions based on the current enrollment count and capacity, so one remaining place succeeds and a full offering rejects.

2. Availability is described as derived and updated as separate state. Affected rules: R2/R4; AC-03 and AC-04. Model elements: CourseOffering.availablePlaces and the formula availablePlaces = capacity - enrollmentCount, plus the sequence message "update available places." If derived, the update duplicates enrollment creation; if stored, the model should specify that count and creation change together. Focused correction: choose one representation and make the update atomic with Enrollment creation.

3. "Atomic" alone does not guarantee concurrent capacity checks are safe. Affected rules: R2/R4, especially AC-04. Model element: the atomic registration group and "check current count against capacity." Two simultaneous requests could both observe the final place unless the operation prevents that race. Focused correction: specify serialized or conditional capacity checking and enforce duplicate uniqueness at persistence.

## Validation cases

- Places available: the success branch creates an Enrollment, updates availability, and returns confirmation, matching AC-03 conceptually; the explicit guard and availability representation remain underspecified.
- Exactly one place: the model intends success, but "places left" does not define the boundary. Use a current-state condition such as enrollmentCount < capacity.
- Full after a stale catalog view: the repository checks the current count, and the full branch returns "course full" without a creation or availability update. This matches AC-05, subject to the concurrency caveat.
- Duplicate registration: the duplicate check precedes the capacity check, so an existing enrollment receives "already enrolled" even if full. No state-changing message appears in that branch, matching AC-06.

## Multiplicities and naming

The multiplicities correctly show that every Enrollment links to exactly one Student and one CourseOffering, while each may have zero or more enrollments. The Course-to-CourseOffering relationship is consistent. CourseOffering selection and registration align with the class model; no naming defect stands out.
~~~~

### B4 — Focused revision (Prompt D)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** apply my accepted review decisions

**Prompt:**

~~~~text
(paste here)
~~~~

**Response:**

~~~~text
(paste here)
~~~~

## 12. Appendix C — Original diagrams

<!-- The AI's first output from Prompt B, rendered unedited from models/original/. -->

![Original sequence diagram](models/img/original-sequence.png)

![Original class diagram](models/img/original-classes.png)

## 13. Appendix D — References and source checks

### References

<!-- Full references, one per line, each starting with "- ". Only sources you actually opened.
     Every URL used in the source checks must also appear here. Example:
     - Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 5. -->

- (write here)

### Source checks

<!-- At least two modeling decisions you verified. Source and locator: title + slide, page,
     section, chapter or figure — or title + URL + access date (YYYY-MM-DD). Slide numbers
     refer to the decks posted in our Teams. -->

| Modeling decision | Source and locator | What the source says | How it supports or changed your model |
| --- | --- | --- | --- |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |
