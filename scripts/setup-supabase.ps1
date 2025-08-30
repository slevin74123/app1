# Script de configurare automată Supabase
# Rulează acest script pentru a configura automat Supabase

param(
    [string]$ProjectPath = ".",
    [string]$SupabaseUrl = "",
    [string]$SupabaseKey = ""
)

$ErrorActionPreference = "Continue"

Write-Host "🔧 Configurare automată Supabase" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

function Test-SupabaseConnection {
    param([string]$Url, [string]$Key)
    
    try {
        Write-Host "🔍 Testez conexiunea la Supabase..." -ForegroundColor Yellow
        
        $headers = @{
            'apikey' = $Key
            'Authorization' = "Bearer $Key"
        }
        
        $response = Invoke-WebRequest -Uri "$Url/rest/v1/" -Method Head -Headers $headers -TimeoutSec 10 -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Conexiunea la Supabase funcționează!" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Status code neașteptat: $($response.StatusCode)" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ Eroare la conectarea la Supabase: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Create-EnvFile {
    param([string]$Url, [string]$Key)
    
    $envContent = @"
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$Url
NEXT_PUBLIC_SUPABASE_ANON_KEY=$Key

# Supabase Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
"@
    
    $envPath = Join-Path $ProjectPath ".env.local"
    
    try {
        $envContent | Out-File -FilePath $envPath -Encoding UTF8
        Write-Host "✅ Fișierul .env.local creat: $envPath" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Eroare la crearea fișierului .env.local: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Update-SupabaseConfig {
    param([string]$Url, [string]$Key)
    
    $configPath = Join-Path $ProjectPath "src\config\supabase.ts"
    
    try {
        $content = Get-Content -Path $configPath -Raw
        
        # Actualizează URL-ul
        $content = $content -replace 'URL:.*', "URL: '$Url',"
        
        # Actualizează cheia
        $content = $content -replace 'ANON_KEY:.*', "ANON_KEY: '$Key',"
        
        $content | Out-File -FilePath $configPath -Encoding UTF8
        
        Write-Host "✅ Configurația Supabase actualizată" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Eroare la actualizarea configurației: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Restart-Application {
    Write-Host "🔄 Restart aplicație..." -ForegroundColor Yellow
    
    try {
        # Oprește procesele Node.js
        Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
        
        # Șterge cache-ul
        if (Test-Path "$ProjectPath\.next") {
            Remove-Item "$ProjectPath\.next" -Recurse -Force
            Write-Host "   ✅ Cache șters" -ForegroundColor Green
        }
        
        # Curăță cache-ul npm
        Set-Location $ProjectPath
        npm cache clean --force | Out-Null
        
        # Reinstalează dependențele
        Write-Host "   📦 Reinstalez dependențele..." -ForegroundColor Yellow
        npm install | Out-Null
        
        Write-Host "✅ Aplicația gata pentru restart" -ForegroundColor Green
        Write-Host "   Rulează: npm run dev" -ForegroundColor Cyan
        
    }
    catch {
        Write-Host "❌ Eroare la restart: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Main execution
try {
    Set-Location $ProjectPath
    
    # Verifică dacă sunt furnizate credențialele
    if ([string]::IsNullOrEmpty($SupabaseUrl) -or [string]::IsNullOrEmpty($SupabaseKey)) {
        Write-Host "📝 Introdu credențialele Supabase:" -ForegroundColor Yellow
        
        if ([string]::IsNullOrEmpty($SupabaseUrl)) {
            $SupabaseUrl = Read-Host "URL Supabase (ex: https://your-project.supabase.co)"
        }
        
        if ([string]::IsNullOrEmpty($SupabaseKey)) {
            $SupabaseKey = Read-Host "Cheia anonimă Supabase"
        }
    }
    
    # Validează URL-ul
    if ($SupabaseUrl -notmatch "^https://.*\.supabase\.co$") {
        Write-Host "❌ URL Supabase invalid. Trebuie să fie de forma: https://your-project.supabase.co" -ForegroundColor Red
        exit 1
    }
    
    # Testează conexiunea
    if (Test-SupabaseConnection -Url $SupabaseUrl -Key $SupabaseKey) {
        
        # Creează fișierul .env.local
        if (Create-EnvFile -Url $SupabaseUrl -Key $SupabaseKey) {
            
            # Actualizează configurația
            if (Update-SupabaseConfig -Url $SupabaseUrl -Key $SupabaseKey) {
                
                Write-Host ""
                Write-Host "🎉 Configurarea Supabase completată cu succes!" -ForegroundColor Green
                Write-Host ""
                Write-Host "📋 Următorii pași:" -ForegroundColor Cyan
                Write-Host "   1. Verifică că fișierul .env.local a fost creat" -ForegroundColor White
                Write-Host "   2. Rulează: npm run dev" -ForegroundColor White
                Write-Host "   3. Testează funcționalitatea" -ForegroundColor White
                Write-Host ""
                
                $restart = Read-Host "Vrei să fac restart automat al aplicației? (y/n)"
                if ($restart -eq "y" -or $restart -eq "Y") {
                    Restart-Application
                }
            }
        }
    } else {
        Write-Host ""
        Write-Host "❌ Nu s-a putut configura Supabase. Verifică:" -ForegroundColor Red
        Write-Host "   - URL-ul proiectului" -ForegroundColor White
        Write-Host "   - Cheia anonimă" -ForegroundColor White
        Write-Host "   - Conectivitatea la internet" -ForegroundColor White
        Write-Host "   - Statusul proiectului Supabase" -ForegroundColor White
    }
}
catch {
    Write-Host "❌ Eroare la configurare: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Apasă orice tastă pentru a ieși..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 