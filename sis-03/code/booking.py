"""
Smart Campus Room Availability Checker — final can_book function.
Satisfies AC1-AC5. Standard library only. Signature unchanged.
"""


def can_book(start, end, now, blocked, existing):
    """Return True if the booking request is allowed, False otherwise.

    Parameters
    ----------
    start    : int  — proposed start, minutes after midnight (0–1439)
    end      : int  — proposed end, minutes after midnight (1–1440)
    now      : int  — current time, minutes after midnight (0–1439)
    blocked  : bool — True if the room is administratively blocked
    existing : list of (int, int) — already-booked (start, end) pairs

    Returns
    -------
    True  when AC1, AC2, AC3, AC4 all hold.
    False otherwise.
    Never raises; never mutates existing.
    """
    # AC1: valid interval within the day
    if (
        isinstance(start, bool)
        or isinstance(end, bool)
        or not isinstance(start, int)
        or not isinstance(end, int)
    ):
        return False
    if not (0 <= start < end <= 1440):
        return False

    # AC1: start must be strictly after now
    if start <= now:
        return False

    # AC2: duration must not exceed 120 minutes
    if end - start > 120:
        return False

    # AC3: room is blocked — reject everything
    if blocked:
        return False

    # AC4: overlap check. Intervals are [start, end).
    # Overlap exists iff start < e and end > s.
    # Touching endpoints (start == e or end == s) are explicitly allowed.
    for s, e in existing:
        if start < e and end > s:
            return False

    return True
