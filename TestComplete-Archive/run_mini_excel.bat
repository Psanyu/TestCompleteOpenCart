@echo off
cd /d "%~dp0"
python mini_excel_testcomplete.py
if errorlevel 1 pause
