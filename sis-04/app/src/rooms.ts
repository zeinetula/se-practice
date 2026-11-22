// The room catalog: data only. Fictional rooms and bookings, no logic.
// Times are minutes after midnight (600 = 10:00).

// A booking is a time interval; `id` and `bookedBy` are labels for the page only.
export interface Booking {
  start: number;
  end: number;
  id?: string;
  bookedBy?: string;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: Booking[];
}

export const ROOMS: Room[] = [
  {
    id: 'r-101',
    name: 'Hawking Hall 101',
    building: 'Science Block',
    capacity: 40,
    equipment: ['projector', 'whiteboard'],
    blocked: false,
    bookings: [
      { id: 'b1', start: 540, end: 600, bookedBy: 'Dr. Vega' },
      { id: 'b2', start: 780, end: 840, bookedBy: 'Dept. of Physics' },
    ],
  },
  {
    id: 'r-202',
    name: 'Curie Lab 202',
    building: 'Science Block',
    capacity: 24,
    equipment: ['whiteboard', 'lab-bench'],
    blocked: true,
    bookings: [],
  },
  {
    id: 'r-305',
    name: 'Turing Lecture 305',
    building: 'CS Building',
    capacity: 120,
    equipment: ['projector', 'microphone', 'video-conferencing'],
    blocked: false,
    bookings: [{ id: 'b3', start: 600, end: 660, bookedBy: 'Algorithms 201' }],
  },
  {
    id: 'r-110',
    name: 'Da Vinci Studio 110',
    building: 'Arts Wing',
    capacity: 16,
    equipment: ['whiteboard', 'drawing-tables'],
    blocked: false,
    bookings: [{ id: 'b4', start: 900, end: 1020, bookedBy: 'Design Studio' }],
  },
  {
    id: 'r-120',
    name: 'Lovelace Seminar 120',
    building: 'CS Building',
    capacity: 12,
    equipment: ['projector', 'whiteboard', 'video-conferencing'],
    blocked: false,
    bookings: [{ id: 'b5', start: 840, end: 900, bookedBy: 'Thesis Group' }],
  },
];

// Every equipment name used by a room, sorted: the options of the equipment filter.
export const EQUIPMENT: string[] = Array.from(new Set(ROOMS.flatMap((r) => r.equipment))).sort();
