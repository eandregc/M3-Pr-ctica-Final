# Test script para verificar la configuración local
Write-Host "🧪 Probando configuración local..." -ForegroundColor Green

# Check if node_modules exist
if (-not (Test-Path "client\node_modules")) {
    Write-Host "❌ Dependencias del cliente no instaladas. Ejecuta: cd client && npm install" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "server\node_modules")) {
    Write-Host "❌ Dependencias del servidor no instaladas. Ejecuta: cd server && npm install" -ForegroundColor Red
    exit 1
}

# Check if build exists
if (-not (Test-Path "client\build")) {
    Write-Host "⚠️ Build del cliente no encontrado. Ejecutando npm run build..." -ForegroundColor Yellow
    Set-Location client
    npm run build
    Set-Location ..
}

# Check if public folder is populated
if (-not (Test-Path "server\public\index.html")) {
    Write-Host "⚠️ Archivos estáticos no copiados. Copiando..." -ForegroundColor Yellow
    if (Test-Path "server\public") {
        Remove-Item -Recurse -Force "server\public"
    }
    New-Item -ItemType Directory -Path "server\public" -Force | Out-Null
    Copy-Item -Recurse -Force "client\build\*" "server\public\"
}

Write-Host "✅ Configuración verificada!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Para iniciar el servidor:" -ForegroundColor Cyan
Write-Host "   cd server" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 La aplicación estará disponible en: http://localhost:3001" -ForegroundColor Cyan
