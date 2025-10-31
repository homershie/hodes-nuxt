@echo off
chcp 65001 >nul
setlocal

REM 切換到腳本所在目錄的父目錄（專案根目錄）
cd /d "%~dp0.."

echo ====================================
echo 清理構建輸出目錄
echo ====================================
echo.

REM 關閉可能佔用 output 目錄的 Node.js 進程
echo [步驟 1] 檢查 Node.js 進程...
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo 發現 Node.js 進程正在運行，正在關閉...
    taskkill /F /IM node.exe >nul 2>&1
    if "%ERRORLEVEL%"=="0" (
        echo ✅ 已關閉所有 Node.js 進程
        timeout /t 2 /nobreak >nul
    ) else (
        echo ⚠️  關閉進程時出現錯誤
    )
) else (
    echo ✓ 沒有發現 Node.js 進程
)
echo.

REM 刪除 output 目錄
echo [步驟 2] 刪除 output 目錄...
if exist "output" (
    echo 正在刪除 output 目錄...
    rmdir /s /q "output" 2>nul
    timeout /t 1 /nobreak >nul
    
    if exist "output" (
        echo ❌ 刪除失敗！目錄仍被鎖定
        echo.
        echo 請手動操作：
        echo 1. 關閉檔案總管中打開的 output 目錄
        echo 2. 關閉 VS Code/Cursor 等開發工具
        echo 3. 確保沒有防毒軟體正在掃描該目錄
        exit /b 1
    ) else (
        echo ✅ 成功刪除 output 目錄
    )
) else (
    echo ℹ️  output 目錄不存在，無需刪除
)

REM 清理其他構建緩存
echo.
echo [步驟 3] 清理其他構建緩存...
if exist ".nuxt" (
    rmdir /s /q ".nuxt" 2>nul
    echo ✓ 清理 .nuxt 目錄
)
if exist ".output" (
    rmdir /s /q ".output" 2>nul
    echo ✓ 清理 .output 目錄
)

echo.
echo ====================================
echo ✨ 清理完成！
echo ====================================
endlocal

