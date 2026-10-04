# Acceptance Criteria — Smart Campus Study Room Booking

## Assumptions (Global)
1. **R2 Duration Interpretation:** A booking duration of exactly two hours (120 minutes) is allowed.
2. **R3 Overlap Interpretation:** Back-to-back bookings (e.g., a booking ending at 12:00 and another starting at 12:00) do NOT constitute an overlap under rule R3.

---

## Acceptance Criteria for US-01: View Available Study Rooms

### AC-01-01: Successful retrieval of available time slots
* **Given** a student is viewing the study room schedule for a selected date,
* **When** they request available time slots for room "Room A",
* **Then** the system displays all unreserved and unblocked time slots for that room on that date.

### AC-01-02: Exclude blocked rooms from availability
* **Given** "Room B" has been blocked by an Administrator,
* **When** a student views the availability schedule,
* **Then** "Room B" is marked as unavailable/blocked and cannot be selected for any time slot.

### AC-01-03: Exclude past time slots
* **Given** the current time is 14:00 on the selected date,
* **When** a student views available rooms,
* **Then** all time slots ending at or before 14:00 are hidden or marked as unavailable.

---

## Acceptance Criteria for US-02: Reserve a Study Room

### AC-02-01: Successful booking (Happy Path)
* **Given** "Room A" is free tomorrow from 10:00 to 12:00 (exactly 2 hours),
* **When** a student submits a reservation for "Room A" from 10:00 to 12:00,
* **Then** the system confirms the booking and marks "Room A" as reserved for that duration.

### AC-02-02: Reject overlapping booking (Rule R3)
* **Given** "Room A" is already reserved tomorrow from 10:00 to 12:00,
* **When** another student attempts to book "Room A" from 11:00 to 13:00,
* **Then** the system rejects the booking request with an error indicating a schedule conflict.

### AC-02-03: Allow back-to-back bookings (Boundary Condition)
* **Given** "Room A" is reserved tomorrow from 10:00 to 12:00,
* **When** a student submits a booking for "Room A" from 12:00 to 14:00,
* **Then** the system accepts and successfully creates the reservation.

### AC-02-04: Reject duration exceeding two hours (Rule R2)
* **Given** a student attempts to reserve "Room A" for a single session,
* **When** the requested slot duration is set from 10:00 to 12:30 (2.5 hours),
* **Then** the system rejects the request due to exceeding the maximum allowed 2-hour duration.

### AC-02-05: Reject booking in the past (Rule R1)
* **Given** the current time is 15:00 today,
* **When** a student attempts to submit a booking starting at 14:00 today,
* **Then** the system rejects the request with an error stating bookings must start in the future.

---

## Acceptance Criteria for US-05: Block Room from Service

### AC-05-01: Administrator blocks an active room (Rule R4)
* **Given** an Administrator needs to take "Room C" out of service,
* **When** the Administrator applies a block action to "Room C",
* **Then** the system changes the room status to "Blocked" and prevents future booking attempts for this room.

### AC-05-02: Prevent student booking on blocked room
* **Given** "Room C" is currently in "Blocked" status,
* **When** a student attempts to submit a booking for "Room C",
* **Then** the system denies the action and displays a message stating the room is out of service.

### AC-05-03: Rejection of non-admin access
* **Given** a Student attempts to trigger a room block action,
* **When** the system processes the request,
* **Then** the system denies permission and retains the current room state.