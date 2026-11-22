# AGENTS.md — Smart Campus Room Availability Checker

Instructions for any coding agent working in this project. Read this file before you change
anything, and follow it over any general habit of yours.

## Project

A React + TypeScript page (Vite) that tells a student whether a campus room is free for a
requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
the tests are in `src/booking.test.ts`.

Use one fictional room and fictional data only: no real room names, timetables or KBTU portal data.

## Acceptance contract

- AC1 Reject start ≥ end and requests in the past.
- AC2 Enforce the maximum allowed duration (120 minutes).
- AC3 Reject a blocked room.
- AC4 Reject overlaps. A request that only touches a booking at an endpoint is allowed.
- AC5 Return Available / Unavailable without changing booking data.
- AC6 Preserve clear UI feedback on desktop and mobile.

## Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Tests: `npm test`
- Build: `npm run build`

## You may

- Edit any file in the project.
- Do not add packages, a login page or a database (no Supabase).
- Never commit secrets, API keys, tokens or a .env file.

## Before you finish

- Run `npm test` and `npm run build`; the tests must pass before you say the work is done.
- Do not deploy or publish anywhere (no Netlify, no --prod); the team reviews it locally.
