# Setup script for Veterinaria App deployment (PowerShell)
Write-Host "🏥 Configurando aplicación de Veterinaria para deployment..." -ForegroundColor Green

# Install dependencies for both client and server
Write-Host "📦 Instalando dependencias del cliente..." -ForegroundColor Yellow
Set-Location client
npm install

Write-Host "📦 Instalando dependencias del servidor..." -ForegroundColor Yellow
Set-Location ..\server
npm install

# Build the frontend
Write-Host "🔨 Construyendo el frontend..." -ForegroundColor Yellow
Set-Location ..\client
npm run build

# Copy frontend build to server
Write-Host "📁 Copiando build del frontend al servidor..." -ForegroundColor Yellow
if (Test-Path "..\server\public") {
    Remove-Item -Recurse -Force "..\server\public"
}
New-Item -ItemType Directory -Path "..\server\public" -Force | Out-Null
Copy-Item -Recurse -Force "build\*" "..\server\public\"

# Create web.config for Azure
Write-Host "⚙️ Creando configuración para Azure..." -ForegroundColor Yellow
Set-Location ..\server

$webConfig = @'
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="index.js" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <rule name="StaticContent">
          <action type="Rewrite" url="public{REQUEST_URI}"/>
        </rule>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
          </conditions>
          <action type="Rewrite" url="index.js"/>
        </rule>
      </rules>
    </rewrite>
    <iisnode watchedFiles="web.config;*.js"/>
  </system.webServer>
</configuration>
'@

$webConfig | Out-File -FilePath "web.config" -Encoding UTF8

Write-Host "✅ ¡Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Configura los secrets en GitHub:" -ForegroundColor White
Write-Host "   - AZURE_WEBAPP_BACKEND_NAME" -ForegroundColor Gray
Write-Host "   - AZURE_WEBAPP_BACKEND_PUBLISH_PROFILE" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Haz push a la rama main para activar el deployment" -ForegroundColor White
Write-Host ""
Write-Host "3. Para probar localmente:" -ForegroundColor White
Write-Host "   cd server && npm start" -ForegroundColor Gray
Write-Host "   Luego visita: http://localhost:3001" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 Revisa AZURE_DEPLOYMENT.md para instrucciones detalladas" -ForegroundColor Cyan

# Return to root directory
Set-Location ..
