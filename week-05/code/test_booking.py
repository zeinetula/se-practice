import unittest
from booking import can_book

class TestCanBook(unittest.TestCase):
    # 6 базовых кейсов
    def test_touching_endpoints_returns_true(self):
        self.assertTrue(can_book(660, 720, 540, False, [(600, 660)]))

    def test_exactly_two_hours_returns_true(self):
        self.assertTrue(can_book(720, 840, 540, False, [(600, 660)]))

    def test_overlap_returns_false(self):
        self.assertFalse(can_book(630, 690, 540, False, [(600, 660)]))

    def test_over_two_hours_returns_false(self):
        self.assertFalse(can_book(720, 841, 540, False, [(600, 660)]))

    def test_blocked_room_returns_false(self):
        self.assertFalse(can_book(660, 720, 540, True, [(600, 660)]))

    def test_starts_now_returns_true(self):
        self.assertTrue(can_book(540, 570, 540, False, []))

    # Дополнительные граничные тесты
    def test_start_before_now_returns_false(self):
        self.assertFalse(can_book(500, 570, 540, False, []))

    def test_zero_length_booking_returns_false(self):
        self.assertFalse(can_book(600, 600, 540, False, []))

    def test_reversed_times_returns_false(self):
        self.assertFalse(can_book(700, 600, 540, False, []))

    def test_day_bounds_exceeded_returns_false(self):
        self.assertFalse(can_book(1400, 1441, 540, False, []))

    def test_empty_existing_bookings_returns_true(self):
        self.assertTrue(can_book(600, 660, 540, False, []))

    def test_existing_tuple_unchanged(self):
        existing_list = [(600, 660)]
        can_book(660, 720, 540, False, existing_list)
        self.assertEqual(existing_list, [(600, 660)])

if __name__ == '__main__':
    unittest.main()