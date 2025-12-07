# ===== PATH CONFIG =====
$scriptRoot   = $PSScriptRoot
$BackendDir   = Join-Path $scriptRoot "..\backend"
$FrontendDir  = Join-Path $scriptRoot "..\interface"
$logsDir      = Join-Path $scriptRoot "..\logs"

$repoRoot = Join-Path $scriptRoot ".."
$venvDir  = Join-Path $repoRoot ".venv"
$venvPython = Join-Path $venvDir "Scripts\python.exe"

$UvicornPort  = 1810
$FrontendPort = 1012

# ===== UTIL: KILL PROCESS TREE =====
function Kill-PidTree {
    param([int]$TargetPid)
    if (-not $TargetPid) { return }
    try {
        Stop-Process -Id $TargetPid -Force -ErrorAction Stop
        return
    } catch {
        # Jika Stop-Process gagal, cek apakah proses masih ada sebelum memanggil taskkill
        if (-not (Get-Process -Id $TargetPid -ErrorAction SilentlyContinue)) {
            return
        }
        try {
            Start-Process -FilePath "taskkill" -ArgumentList "/PID", $TargetPid, "/T", "/F" -NoNewWindow -Wait -WindowStyle Hidden | Out-Null
        } catch {
            # ignore any errors from taskkill
        }
    }
}

# ===== CLEANUP PORT =====
function Cleanup-Port1810 {
    $conns = netstat -ano | Select-String ":1810"
    if ($conns) {
        Write-Host "`nCleaning port 1810..." -ForegroundColor Yellow
        foreach ($line in $conns) {
            $foundPid = ($line -split "\s+")[-1]
            if ($foundPid -match '^\d+$') {
                Write-Host "Kill PID $foundPid" -ForegroundColor DarkYellow
                Kill-PidTree -TargetPid $foundPid
            }
        }
    }
}

# ===== ENSURE VENV + PIP INSTALL =====
function Ensure-VenvAndInstall {
    # Always try to run pip install -r backend/requirements.txt using .venv python if available
    if (!(Test-Path $logsDir)) { New-Item -ItemType Directory $logsDir | Out-Null }
    $reqFile = Join-Path $repoRoot "backend\requirements.txt"
    if (!(Test-Path $reqFile)) {
        Write-Host "requirements.txt not found at $reqFile — skipping pip install." -ForegroundColor Yellow
        return
    }

    if (Test-Path $venvPython) {
        Write-Host "Activating .venv and installing requirements via $venvPython ..." -ForegroundColor Cyan
        $pipOut = Join-Path $logsDir "pip_install.log"
        $pipErr = Join-Path $logsDir "pip_install_error.log"
        $args = @("-m","pip","install","-r", $reqFile)
        $p = Start-Process -FilePath $venvPython -ArgumentList $args -NoNewWindow -Wait -PassThru -RedirectStandardOutput $pipOut -RedirectStandardError $pipErr
        if ($p.ExitCode -eq 0) { Write-Host "pip install succeeded." -ForegroundColor Green } else { Write-Host "pip install finished with exit code $($p.ExitCode). See $pipErr" -ForegroundColor Yellow }
    } else {
        Write-Host ".venv python not found at $venvPython — attempting system pip install (may require permissions)." -ForegroundColor Yellow
        $pipOut = Join-Path $logsDir "pip_install.log"
        $pipErr = Join-Path $logsDir "pip_install_error.log"
        $args = @("-m","pip","install","-r", $reqFile)
        $p = Start-Process -FilePath "python" -ArgumentList $args -NoNewWindow -Wait -PassThru -RedirectStandardOutput $pipOut -RedirectStandardError $pipErr
        if ($p.ExitCode -eq 0) { Write-Host "system pip install succeeded." -ForegroundColor Green } else { Write-Host "system pip install finished with exit code $($p.ExitCode). See $pipErr" -ForegroundColor Yellow }
    }
}

# ===== START BACKEND =====
function Start-Backend {
    Write-Host "Start Backend (Uvicorn) ..." -ForegroundColor Green

    if (!(Test-Path $BackendDir)) { 
        Write-Host "Backend not found!" -ForegroundColor Red
        return $null 
    }

    if (!(Test-Path $logsDir)) { New-Item -ItemType Directory $logsDir | Out-Null }

    $backendOut = Join-Path $logsDir "backend.log"
    $backendErr = Join-Path $logsDir "backend_error.log"

    if (Test-Path $venvPython) {
        # Use venv python to run uvicorn so correct env is used
        $args = @("-m","uvicorn","main:app","--port", "$UvicornPort", "--reload")
        $proc = Start-Process -FilePath $venvPython -ArgumentList $args -WorkingDirectory $BackendDir -PassThru -NoNewWindow -RedirectStandardOutput $backendOut -RedirectStandardError $backendErr
    } else {
        $args = @("main:app", "--port", "$UvicornPort", "--reload")
        $proc = Start-Process -FilePath "uvicorn" -ArgumentList $args -WorkingDirectory $BackendDir -PassThru -NoNewWindow -RedirectStandardOutput $backendOut -RedirectStandardError $backendErr
    }

    Write-Host "Backend PID: $($proc.Id)" -ForegroundColor Cyan
    return $proc
}

# ===== START FRONTEND =====
function Start-Frontend {
    Write-Host "Start Interface (npm run dev) ..." -ForegroundColor Cyan

    if (!(Test-Path $FrontendDir)) { 
        Write-Host "Interface folder not found!" -ForegroundColor Red
        return $null 
    }

    if (!(Test-Path $logsDir)) { New-Item -ItemType Directory $logsDir | Out-Null }

    $proc = Start-Process "npm" `
        -ArgumentList "run","dev" `
        -WorkingDirectory $FrontendDir `
        -PassThru `
        -NoNewWindow `
        -RedirectStandardOutput (Join-Path $logsDir "interface.log") `
        -RedirectStandardError  (Join-Path $logsDir "interface_error.log")

    Write-Host "Frontend PID: $($proc.Id)" -ForegroundColor Cyan
    return $proc
}

# ===== MAIN =====
Write-Host "Starting environment for Lycus..." -ForegroundColor Magenta

Cleanup-Port1810

# Ensure venv exists and install backend requirements every run
Ensure-VenvAndInstall

$backendProc  = Start-Backend
$frontendProc = Start-Frontend

$script:childPids = @()
if ($backendProc)  { $script:childPids += $backendProc.Id }
if ($frontendProc) { $script:childPids += $frontendProc.Id }

Write-Host ""
Write-Host "Backend:   http://localhost:$UvicornPort"
Write-Host "Interface: http://localhost:$FrontendPort"
Write-Host ""
Write-Host "Ketik 'stop' lalu tekan ENTER untuk mematikan semua proses." -ForegroundColor Yellow

# ===== LISTEN FOR 'stop' =====
try {
    while ($true) {
        $input = Read-Host
        if ($input -eq "stop") { break }
    }
} finally {
    Write-Host "`nKilling all processes..." -ForegroundColor Red

    foreach ($childPid in $script:childPids) {
        if (Get-Process -Id $childPid -ErrorAction SilentlyContinue) {
            Kill-PidTree -TargetPid $childPid
        }
    }

    Cleanup-Port1810

    Write-Host "All processes terminated. Port 1810 is clean." -ForegroundColor Green
}
