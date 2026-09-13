   ```
   Build a small program that processes a list of student marks and prints:
   average, highest, lowest, and pass rate.
   ```
A clean web-based student marks processor where a teacher or educator pastes a comma or line-separated list of marks, sets a custom pass threshold, and instantly sees the calculated average, highest mark, lowest mark, and pass rate — all in one clear results view.

input1
85, 23, 45, 90, 92

output1
Class Average
67.0
Above pass threshold (50)

Highest Mark
92
Top performer in the class

Lowest Mark
23
Below pass threshold

Pass Rate
60.0%
3 of 5 students passed

Pass Count
3
Threshold ≥ 50

Fail Count
2
Scored below 50

input2
88, 47, -5, 101, abc, 73, 50, , 100

output2
Class Average
71.6
Above pass threshold (50)

Highest Mark
100
Top performer in the class

Lowest Mark
47
Below pass threshold

Pass Rate
80.0%
4 of 5 students passed

Pass Count
4
Threshold ≥ 50

Fail Count
1
Scored below 50

input3
10, 20, 30

output3
Class Average
20.0
Below pass threshold (50)

Highest Mark
30
Top performer in the class

Lowest Mark
10
Below pass threshold

Pass Rate
0.0%
0 of 3 students passed

Pass Count
0
Threshold ≥ 50

Fail Count
3
Scored below 50

input4
abc, , xyz

output4
No valid marks found. Marks must be numbers between 0 and 100.