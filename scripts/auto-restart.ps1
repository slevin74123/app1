# Script de restart automat pentru Next.js
# Rulează acest script pentru a monitoriza și restarta automat aplicația

param(
    [string]$ProjectPath = ".",
    [int]$CheckInterval = 30,
    [int]$MaxRestarts = 5
)

$ErrorActionPreference = "Continue"
$restartCount = 0
$lastRestart = Get-Date

Write-Host "🚀 Monitorizare Next.js - Auto Restart" -ForegroundColor Green
Write-Host "Proiect: $ProjectPath" -ForegroundColor Yellow
Write-Host "Interval verificare: $CheckInterval secunde" -ForegroundColor Yellow
Write-Host "Max restart-uri: $MaxRestarts" -ForegroundColor Yellow
Write-Host ""

function Test-NextJsHealth {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head -TimeoutSec 10 -ErrorAction Stop
        return $response.StatusCode -eq 200
    }
    catch {
        return $false
    }
}

function Restart-NextJs {
    param([string]$Reason)
    
    $currentTime = Get-Date
    $timeSinceLastRestart = ($currentTime - $lastRestart).TotalMinutes
    
    if ($restartCount -ge $MaxRestarts -and $timeSinceLastRestart -lt 5) {
        Write-Host "⚠️  Prea multe restart-uri în timp scurt. Aștept 5 minute..." -ForegroundColor Yellow
        Start-Sleep -Seconds 300
        $restartCount = 0
    }
    
    Write-Host "🔄 Restart Next.js: $Reason" -ForegroundColor Cyan
    Write-Host "   Timp: $currentTime" -ForegroundColor Gray
    
    try {
        # Oprește procesele Node.js
        Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
        
        # Șterge cache-ul Next.js
        if (Test-Path "$ProjectPath\.next") {
            Remove-Item "$ProjectPath\.next" -Recurse -Force
            Write-Host "   ✅ Cache .next șters" -ForegroundColor Green
        }
        
        # Curăță cache-ul npm
        Set-Location $ProjectPath
        npm cache clean --force | Out-Null
        
        # Reinstalează dependențele
        Write-Host "   📦 Reinstalez dependențele..." -ForegroundColor Yellow
        npm install | Out-Null
        
        # Pornește aplicația
        Write-Host "   🚀 Pornesc aplicația..." -ForegroundColor Yellow
        Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Minimized
        
        $restartCount++
        $lastRestart = $currentTime
        
        Write-Host "   ✅ Restart completat (Total: $restartCount)" -ForegroundColor Green
        
        # Așteaptă să se pornească
        Start-Sleep -Seconds 15
        
    }
    catch {
        Write-Host "   ❌ Eroare la restart: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Monitor-NextJs {
    Write-Host "📊 Monitorizare pornită..." -ForegroundColor Green
    
    while ($true) {
        $currentTime = Get-Date
        $status = Test-NextJsHealth
        
        if ($status) {
            Write-Host "[$($currentTime.ToString('HH:mm:ss'))] ✅ Aplicația funcționează" -ForegroundColor Green
        } else {
            Write-Host "[$($currentTime.ToString('HH:mm:ss'))] ❌ Aplicația nu răspunde" -ForegroundColor Red
            Restart-NextJs "Aplicația nu răspunde"
        }
        
        Start-Sleep -Seconds $CheckInterval
    }
}

# Pornește monitorizarea
try {
    Monitor-NextJs
}
catch {
    Write-Host "❌ Eroare la monitorizare: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Apasă orice tastă pentru a ieși..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
} 