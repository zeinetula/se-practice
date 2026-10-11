#Chat-gpt 
marks = [85, 72, 90, 65, 78, 95, 88, 60, 74, 92]

average = sum(marks) / len(marks)
highest = max(marks)
lowest = min(marks)
passed = sum(mark >= 50 for mark in marks)
failed = len(marks) - passed

print("Marks:", marks)
print("Average:", round(average, 2))
print("Highest:", highest)
print("Lowest:", lowest)
print("Passed:", passed)
print("Failed:", failed)