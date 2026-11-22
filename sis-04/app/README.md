# Smart Campus Room Availability Checker (SIS #04)

A room catalog (5 fictional rooms) with a capacity and equipment filter, and an availability check
that uses the chosen room's own bookings. Fictional data only: no login, payments, live APIs or database.

## Setup, run, test

```text
npm install          # setup
npm run dev          # run: open the address Vite prints
npx vitest run       # test: all tests, once
npm run typecheck    # optional: TypeScript check
```

## Modules (src/)

| File | Responsibility |
| --- | --- |
| `rooms.ts` | the catalog: `Room` type, `ROOMS`, `EQUIPMENT` (data only) |
| `booking.ts` | the rules: `canBook` (AC1-AC5), `checkRoom` (F3, F5), `explainRejection`, `whyUnavailable` |
| `filter.ts` | `filterRooms` (F1 capacity, F2 equipment) |
| `lib/time.ts`, `lib/messages.ts` | time formatting; the wording of a result (no rules) |
| `App.tsx`, `components/` | the page: state and presentation, rules imported |
| `*.test.ts` | Vitest tests: `booking`, `room`, `filter`, `rejection` |
