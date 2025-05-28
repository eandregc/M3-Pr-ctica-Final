# GitHub Secrets Configuration

Para que el pipeline de CI/CD funcione correctamente, necesitas configurar los siguientes secretos en GitHub:

## Cómo configurar los secretos:

1. Ve a tu repositorio en GitHub
2. Navega a **Settings** → **Secrets and variables** → **Actions**
3. Haz clic en **"New repository secret"**
4. Agrega cada uno de los siguientes secretos:

## Secretos requeridos:

### `AZURE_WEBAPP_BACKEND_NAME`
- **Valor**: `sapitos`
- **Descripción**: Nombre de tu Azure Web App (sin .azurewebsites.net)

### `AZURE_WEBAPP_BACKEND_PUBLISH_PROFILE`
- **Valor**: `$sapitos:1UcGLc06KzkYV2dCNWtn64dUXFudgfXHLZgzboxtnRz4vG1doitgj6NU5eqh`
- **Descripción**: Usuario y contraseña de publicación en formato `usuario:contraseña`
- **Nota**: Incluye el símbolo `$` al inicio del usuario como se muestra

## Información de la aplicación:

- **URL de la aplicación**: https://sapitos.azurewebsites.net
- **Base de datos**: Ya configurada en Azure (no requiere configuración adicional)
- **Variables de entorno**: Ya configuradas en Azure App Service

## Estructura del deployment:

1. **Build**: Construye tanto el frontend (React) como el backend (Node.js)
2. **Prepare**: Copia los archivos del frontend build al directorio público del servidor
3. **Deploy**: Comprime el servidor y lo despliega usando zipdeploy
4. **Verify**: Confirma que el deployment fue exitoso

## Notas importantes:

- El archivo `.env` local no se sube a Azure (está excluido)
- Las variables de entorno ya están configuradas directamente en Azure App Service
- El pipeline limpia automáticamente archivos anteriores antes del nuevo deployment
- Se incluye un `web.config` para manejar el routing de SPA en Azure App Service
