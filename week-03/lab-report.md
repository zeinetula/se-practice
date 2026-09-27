


Section2
Smart Campus - study room booking system.
Actors:

Student: A registered KBTU student who reserves rooms for individual or group study.

Administrator: Library staff who keep rooms usable and watch how they are used.

What the system does:

UC-01: View availability (Which rooms are free, and when)

UC-02: Book room (Reserve a free room for a time slot)

UC-03: Cancel booking (Release a reservation the student made)

UC-04: Block or unblock room (Take a room out of service and put it back)

UC-05: Review usage (See how rooms are being used over a period)

UC-06: Send confirmation (The system confirms a booking or a cancellation)

Business Rules:

R1: A booking must start in the future.

R2: A booking lasts at most two hours.

R3: Two bookings for the same room may not overlap.

R4: A blocked room cannot be booked.

Out of scope: payments, fees, fines, penalties, check-in, attendance, QR codes, equipment, cleaning, maintenance requests, SMS, push notifications beyond UC-06, account registration, passwords, waiting lists, screens, databases, servers.

You are a requirements analyst. For the Smart Campus study room booking system, identify Student and Administrator goals. Write 6 to 8 user stories using: As a [role], I want [goal], so that [reason]. Add a priority and one assumption to each story. Stay within the supplied scenario.