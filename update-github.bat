@echo off
echo === Mise a jour GitHub Automatique ===
echo.

:: Lancer le script PowerShell
powershell -ExecutionPolicy Bypass -File "%~dp0update-github.ps1"

echo.
echo === Fin du Script ===
pause 