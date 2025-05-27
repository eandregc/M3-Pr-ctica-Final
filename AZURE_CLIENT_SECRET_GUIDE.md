# 🔑 Guía Rápida: Obtener Azure Client Secret

## Pasos para obtener AZURE_CLIENT_SECRET

### 1. Acceder a Azure Portal
1. Ve a [Azure Portal](https://portal.azure.com)
2. Inicia sesión con tu cuenta

### 2. Buscar App Registration
1. En el buscador superior, escribe "App registrations"
2. Haz clic en **App registrations**
3. Busca la aplicación con Client ID: `A5569ECF5DA843808D9947A38BA10D6D`
4. Haz clic en la aplicación

### 3. Crear Client Secret
1. En el menú izquierdo, haz clic en **Certificates & secrets**
2. En la pestaña **Client secrets**, haz clic en **+ New client secret**
3. Configura:
   - **Description**: "GitHub Actions Deployment"
   - **Expires**: 24 months (recomendado)
4. Haz clic en **Add**

### 4. Copiar el Secret
⚠️ **¡IMPORTANTE!** El valor del secreto solo se muestra una vez.

1. Copia inmediatamente el **Value** (no el Secret ID)
2. Guárdalo temporalmente en un lugar seguro

### 5. Agregar a GitHub
1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Haz clic en **New repository secret**
4. Name: `AZURE_CLIENT_SECRET`
5. Secret: pega el valor copiado del paso 4
6. Haz clic en **Add secret**

### 6. Agregar AZURE_WEBAPP_NAME
1. En GitHub, agrega otro secret:
2. Name: `AZURE_WEBAPP_NAME`
3. Secret: el nombre de tu Azure Web App (sin .azurewebsites.net)

## ✅ Verificación

Una vez configurados ambos secrets, tendrás:
- [x] AZUREAPPSERVICE_CLIENTID_A5569ECF5DA843808D9947A38BA10D6D
- [x] AZUREAPPSERVICE_SUBSCRIPTIONID_92DEC1CF8FB0455488CB5EFE520EB3D5
- [x] AZUREAPPSERVICE_TENANTID_EC69F29D1A0C4634A33DA37693A4A2B0
- [x] AZURE_CLIENT_SECRET
- [x] AZURE_WEBAPP_NAME

## 🚀 ¡Listo para deployment!

Haz push a la rama `main` para activar el deployment automático.
