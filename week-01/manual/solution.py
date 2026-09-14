def analyze_marks(raw_marks):
    valid_marks = []
    
    for mark in raw_marks:
        if isinstance(mark, (int, float)) and not isinstance(mark, bool):
            if 0 <= mark <= 100:
                valid_marks.append(mark)

    if not valid_marks:
        print("No valid marks found.")
        return

    count = len(valid_marks)
    avg_mark = sum(valid_marks) / count
    highest = max(valid_marks)
    lowest = min(valid_marks)

    passed_count = sum(1 for m in valid_marks if m >= 50)
    pass_rate = (passed_count / count) * 100

    print(f"Number of valid marks: {count}")
    print(f"Average mark: {avg_mark:.2f}")
    print(f"Highest mark: {highest}")
    print(f"Lowest mark: {lowest}")
    print(f"Pass rate: {pass_rate:.1f}%")


if __name__ == "__main__":
    test_data = [85, 42, 101, -5, "abc", 90, 50, None]
    print("--- Test Run ---")
    analyze_marks(test_data)