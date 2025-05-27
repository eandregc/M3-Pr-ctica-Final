#!/bin/bash

# Setup script for Veterinaria App deployment
echo "🏥 Configurando aplicación de Veterinaria para deployment..."

# Install dependencies for both client and server
echo "📦 Instalando dependencias del cliente..."
cd client
npm install

echo "📦 Instalando dependencias del servidor..."
cd ../server
npm install

# Build the frontend
echo "🔨 Construyendo el frontend..."
cd ../client
npm run build

# Copy frontend build to server
echo "📁 Copiando build del frontend al servidor..."
if [ -d "../server/public" ]; then
    rm -rf ../server/public
fi
mkdir -p ../server/public
cp -r build/* ../server/public/

# Create web.config for Azure (if needed)
echo "⚙️ Creando configuración para Azure..."
cd ../server
cat > web.config << 'EOF'
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
EOF

echo "✅ ¡Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configura los secrets en GitHub:"
echo "   - AZURE_WEBAPP_BACKEND_NAME"
echo "   - AZURE_WEBAPP_BACKEND_PUBLISH_PROFILE"
echo ""
echo "2. Haz push a la rama main para activar el deployment"
echo ""
echo "3. Para probar localmente:"
echo "   cd server && npm start"
echo "   Luego visita: http://localhost:3001"
echo ""
echo "📖 Revisa AZURE_DEPLOYMENT.md para instrucciones detalladas"
