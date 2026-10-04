# User Stories — Smart Campus Study Room Booking

### US-01: View Available Study Rooms
* **User Story:** As a Student, I want to view free study rooms and their time slots, so that I can find a suitable room for my study session.
* **Priority:** High
* **Assumption:** Rooms marked as blocked by administrators will not appear as available.

### US-02: Reserve a Study Room
* **User Story:** As a Student, I want to book an available study room for a specific time slot, so that I have a guaranteed space to study.
* **Priority:** High
* **Assumption:** Back-to-back bookings (e.g., 10:00–12:00 and 12:00–14:00) are not considered overlapping under business rule R3.

### US-03: Cancel a Reserved Booking
* **User Story:** As a Student, I want to cancel my active booking, so that the room becomes free for other students if I no longer need it.
* **Priority:** Medium
* **Assumption:** Students can only cancel their own future bookings.

### US-04: Receive Booking Confirmation
* **User Story:** As a Student, I want to receive an automated confirmation when I book or cancel a room, so that I have a clear record of my reservation status.
* **Priority:** Medium
* **Assumption:** Confirmations are sent automatically by the system according to UC-06 without external notification channels.

### US-05: Block Room from Service
* **User Story:** As an Administrator, I want to block a study room from service, so that students cannot reserve rooms under maintenance.
* **Priority:** High
* **Assumption:** Blocking a room immediately prevents new bookings from being created for that room.

### US-06: Unblock Room for Service
* **User Story:** As an Administrator, I want to unblock a maintenance room, so that it becomes available for student reservations again.
* **Priority:** Low
* **Assumption:** Unblocking a room restores its availability in the view schedule according to UC-01.

### US-07: Review Room Usage Statistics
* **User Story:** As an Administrator, I want to review study room usage over a selected period, so that I can analyze utilization patterns and optimize room availability.
* **Priority:** Medium
* **Assumption:** Usage reporting aggregates historical booking data within the system without external analytics tools.