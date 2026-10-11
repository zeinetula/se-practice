def analyze_marks(marks, pass_mark=50):
    if not marks:
        raise ValueError("marks cannot be empty")

    if not isinstance(pass_mark, (int, float)) or not 0 <= pass_mark <= 100:
        raise ValueError("pass_mark must be between 0 and 100")

    for mark in marks:
        if not isinstance(mark, (int, float)):
            raise ValueError("all marks must be numeric")
        if not 0 <= mark <= 100:
            raise ValueError("marks must be between 0 and 100")

    average = sum(marks) / len(marks)
    highest = max(marks)
    lowest = min(marks)
    pass_rate = round(sum(mark >= pass_mark for mark in marks) / len(marks) * 100, 2)

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate
    }