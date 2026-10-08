MINI EXCEL - TESTCOMPLETE PRACTICE APP
=========================================

Files:
- mini_excel_testcomplete.py : desktop application source
- run_mini_excel.bat         : double-click launcher for Windows

Requirements:
- Windows with Python 3 installed and added to PATH.
- Tkinter is normally included with standard Python for Windows.

Run:
1. Double-click run_mini_excel.bat
OR
2. Run: python mini_excel_testcomplete.py

Suggested TestComplete practice:
1. Record launch and verify the "Mini Excel" title.
2. Add a new employee expense.
3. Verify the new row in the grid.
4. Select a row and update the amount.
5. Verify the total changes.
6. Search for "John".
7. Delete a selected row and verify the confirmation dialog.
8. Click Add with blank required fields and verify "Validation Error".
9. Enter a negative/non-numeric amount and verify validation.
10. Click Save and verify the Save confirmation dialog.
11. Reset Sample Data and verify the three original rows return.

The UI uses standard Tkinter controls (Entry, Combobox, Button, Treeview,
message boxes), making it useful for practicing object identification,
properties, actions, checkpoints, data-driven tests, and keyword tests.
