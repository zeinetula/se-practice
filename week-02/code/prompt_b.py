def analyze_marks(marks, pass_mark=50):
    if not marks:
        raise ValueError("marks cannot be empty")

    if not 0 <= pass_mark <= 100:
        raise ValueError("pass_mark must be between 0 and 100")

    for mark in marks:
        if not isinstance(mark, (int, float)) or isinstance(mark, bool):
            raise TypeError("marks must contain only numbers")
        if not 0 <= mark <= 100:
            raise ValueError("marks must be between 0 and 100")

    return {
        "average": sum(marks) / len(marks),
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": round(sum(mark >= pass_mark for mark in marks) / len(marks) * 100, 2)
    }