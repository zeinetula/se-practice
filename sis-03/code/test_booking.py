"""
Test suite for can_book — Smart Campus Room Availability Checker.
25 tests covering AC1-AC5 from the brief's required cases and additional edges.
Expected values come from AC1-AC5, never from what the code returns.

Base for every case unless stated otherwise:
    now=540, blocked=False, existing=[(600, 660)]
"""
import unittest
from booking import can_book

BASE_NOW = 540
BASE_EXISTING = [(600, 660)]


class BookingTests(unittest.TestCase):

    # ---- T1: Touching — new slot starts exactly where existing ends (AC4)
    def test_t1_touching_end_is_allowed(self):
        """T1: 660-720 with existing 600-660. Touching at 660 → True."""
        self.assertIs(can_book(660, 720, BASE_NOW, False, BASE_EXISTING), True)

    # ---- T2: Overlap — partial overlap with existing booking (AC4)
    def test_t2_overlap_is_rejected(self):
        """T2: 630-690 overlaps 600-660 → False."""
        self.assertIs(can_book(630, 690, BASE_NOW, False, BASE_EXISTING), False)

    # ---- T3: Blocked room (AC3)
    def test_t3_blocked_room_rejects(self):
        """T3: 660-720 but room is blocked → False."""
        self.assertIs(can_book(660, 720, BASE_NOW, True, BASE_EXISTING), False)

    # ---- T4: Exactly 120 minutes (AC2)
    def test_t4_exactly_120_minutes_is_allowed(self):
        """T4: 720-840 is exactly 120 min → True."""
        self.assertIs(can_book(720, 840, BASE_NOW, False, BASE_EXISTING), True)

    # ---- T5: 121 minutes (AC2)
    def test_t5_over_120_minutes_is_rejected(self):
        """T5: 720-841 is 121 min → False."""
        self.assertIs(can_book(720, 841, BASE_NOW, False, BASE_EXISTING), False)

    # ---- T6: Starts now (AC1 — must be strictly after now)
    def test_t6_starts_now_is_rejected(self):
        """T6: start=540 equals now=540 → False (must be strictly after)."""
        self.assertIs(can_book(540, 570, BASE_NOW, False, BASE_EXISTING), False)

    # ---- T7: Reversed times (AC1)
    def test_t7_reversed_times_rejected(self):
        """T7: end < start → False."""
        self.assertIs(can_book(720, 660, BASE_NOW, False, BASE_EXISTING), False)

    # ---- T8: Ends exactly at midnight 1440 (AC1)
    def test_t8_ends_at_midnight_is_allowed(self):
        """T8: 1380-1440 ends exactly at 1440 → True."""
        self.assertIs(can_book(1380, 1440, BASE_NOW, False, BASE_EXISTING), True)

    # ---- T9: Past midnight 1441 (AC1)
    def test_t9_past_midnight_is_rejected(self):
        """T9: end=1441 > 1440 → False."""
        self.assertIs(can_book(1380, 1441, BASE_NOW, False, BASE_EXISTING), False)

    # ---- T10: Second booking overlaps with SECOND existing entry (AC4)
    def test_t10_second_booking_conflict(self):
        """T10: 720-780 with existing [(600,660),(700,760)] overlaps second → False."""
        self.assertIs(
            can_book(720, 780, BASE_NOW, False, [(600, 660), (700, 760)]), False
        )

    # ---- T11: Same check twice — existing must not be mutated (AC5)
    def test_t11_same_check_twice_unchanged(self):
        """T11: calling can_book twice on 660-720 → both must return True."""
        existing = [(600, 660)]
        result1 = can_book(660, 720, BASE_NOW, False, existing)
        result2 = can_book(660, 720, BASE_NOW, False, existing)
        self.assertIs(result1, True)
        self.assertIs(result2, True)  # T11: result of second call

    # ---- Extra: starts in the past (AC1)
    def test_start_in_past_rejected(self):
        """start=500 < now=540 → False."""
        self.assertIs(can_book(500, 530, BASE_NOW, False, BASE_EXISTING), False)

    # ---- Extra: zero-length slot (AC1)
    def test_zero_length_rejected(self):
        """start == end → False (end must be strictly greater than start)."""
        self.assertIs(can_book(700, 700, BASE_NOW, False, BASE_EXISTING), False)

    # ---- Extra: negative start (AC1)
    def test_negative_start_rejected(self):
        """start=-30 violates 0 <= start → False."""
        self.assertIs(can_book(-30, 30, BASE_NOW, False, BASE_EXISTING), False)

    def test_boolean_start_is_not_an_integer_minute(self):
        """bool is an int subclass, but AC1 requires a numeric minute value."""
        self.assertIs(can_book(True, 60, 0, False, []), False)

    # ---- Extra: touching at start (candidate ends where existing starts) (AC4)
    def test_touching_at_start_is_allowed(self):
        """end=600 touches start of existing 600-660 → True."""
        self.assertIs(can_book(570, 600, BASE_NOW, False, BASE_EXISTING), True)

    # ---- Extra: free slot between two bookings (AC4)
    def test_free_slot_between_bookings(self):
        """660-720 between (600,660) and (720,780) → True."""
        self.assertIs(
            can_book(660, 720, BASE_NOW, False, [(600, 660), (720, 780)]), True
        )

    # ---- Extra: overlaps second in unsorted list (AC4)
    def test_overlap_second_in_unsorted_list(self):
        """610-650 overlaps (600,660) which appears second → False."""
        self.assertIs(
            can_book(610, 650, BASE_NOW, False, [(900, 960), (600, 660)]), False
        )

    # ---- Extra: no existing bookings (AC4)
    def test_no_existing_bookings_allowed(self):
        """600-660, no existing bookings → True."""
        self.assertIs(can_book(600, 660, BASE_NOW, False, []), True)

    # ---- Extra: blocked room even with no bookings (AC3)
    def test_blocked_with_no_bookings(self):
        """Room is blocked even when no existing bookings → False."""
        self.assertIs(can_book(660, 720, BASE_NOW, True, []), False)

    # ---- Extra: request CONTAINS the existing booking (AC4 — M8 fault catcher)
    def test_request_contains_existing_booking(self):
        """Request 570-690 completely contains existing 600-660 → False (AC4)."""
        self.assertIs(
            can_book(570, 690, BASE_NOW, False, BASE_EXISTING), False
        )

    # ---- Extra: request CONTAINS existing with start < a and end > b (AC4 — M8)
    def test_request_contains_existing_wide(self):
        """Request 500-700 fully encloses existing 600-660. Must be False (AC4)."""
        self.assertIs(
            can_book(500, 700, BASE_NOW, False, [(600, 660)]), False
        )

    # ---- Extra: AC5 — existing list is not mutated
    def test_existing_is_not_mutated(self):
        """can_book must never add/remove/sort the existing list."""
        existing = [(900, 960), (600, 660), (700, 760)]
        snapshot = list(existing)
        can_book(780, 840, BASE_NOW, False, existing)
        self.assertEqual(existing, snapshot)


    # ---- Extra: AC5 — return value is a real bool
    def test_return_type_is_bool_true(self):
        """AC5: return must be exactly True (bool), not truthy."""
        result = can_book(660, 720, BASE_NOW, False, BASE_EXISTING)
        self.assertIsInstance(result, bool)
        self.assertIs(result, True)

    def test_return_type_is_bool_false(self):
        """AC5: return must be exactly False (bool), not falsy."""
        result = can_book(630, 690, BASE_NOW, False, BASE_EXISTING)
        self.assertIsInstance(result, bool)
        self.assertIs(result, False)


if __name__ == "__main__":
    unittest.main()
