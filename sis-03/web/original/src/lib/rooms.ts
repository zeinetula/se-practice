export interface Booking {
  id: string;
  start: number; // minutes from midnight
  end: number; // minutes from midnight
  bookedBy: string;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
  bookings: Booking[];
}

// Fictional sample data only.
export const SAMPLE_ROOMS: Room[] = [
  {
    id: 'r-101',
    name: 'Hawking Hall 101',
    building: 'Science Block',
    capacity: 40,
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
    blocked: true,
    bookings: [],
  },
  {
    id: 'r-305',
    name: 'Turing Lecture 305',
    building: 'CS Building',
    capacity: 120,
    blocked: false,
    bookings: [
      { id: 'b3', start: 600, end: 660, bookedBy: 'Algorithms 201' },
    ],
  },
  {
    id: 'r-110',
    name: 'Da Vinci Studio 110',
    building: 'Arts Wing',
    capacity: 16,
    blocked: false,
    bookings: [
      { id: 'b4', start: 900, end: 1020, bookedBy: 'Design Studio' },
    ],
  },
];
