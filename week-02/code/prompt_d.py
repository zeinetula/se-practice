def analyze_marks(marks, pass_mark=50):
    if not marks:
        raise ValueError("marks must not be empty")

    if not isinstance(pass_mark, (int, float)) or pass_mark < 0 or pass_mark > 100:
        raise ValueError("invalid pass_mark")

    for mark in marks:
        if not isinstance(mark, (int, float)) or isinstance(mark, bool):
            raise ValueError("invalid mark")
        if mark < 0 or mark > 100:
            raise ValueError("mark must be between 0 and 100")

    return {
        "average": sum(marks) / len(marks),
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": sum(mark >= pass_mark for mark in marks) / len(marks) * 100
    }