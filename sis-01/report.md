# SIS 01: Software Engineering Fundamentals, With an AI in the Loop
**Topic:** 1.3 Software engineering and cost
**Selected System:** Smart Campus Room Booking System for KBTU

## 1. Scenario
* **Question:** How do custom software development decisions affect long-term operational and maintenance costs compared to initial development costs for an academic campus resource booking platform?
* **Users:** KBTU students, faculty members, and administrative facility managers.
* **Problem:** Manual booking of study rooms and lecture halls leads to schedule overlaps, unutilized spaces, and significant administrative overhead.
* **Constraints:**
  1. *Constraint 1:* Must integrate with the existing legacy KBTU Active Directory for single sign-on (SSO).
  2. *Constraint 2:* Strict zero-budget cap for recurring third-party cloud SaaS infrastructure licenses.
* **Risk:** High concurrency traffic spikes during midterm/final exam registration causing database locks and system downtime.
* **Assumptions:** [FICTIONAL] The system serves approximately 5,000 active daily users across 2 physical campus buildings in Almaty.

## 7. Outline
1. Custom software costs depend heavily on long-term maintenance rather than just initial coding.
2. Legacy system integration (KBTU Active Directory) adds unexpected development and testing overhead.
3. High traffic during exam periods risks system crashes if database locking is not properly handled.
4. Using open-source frameworks helps satisfy zero-budget constraints for third-party licenses.
5. Simple modular architectures reduce deployment and infrastructure costs compared to complex microservices.