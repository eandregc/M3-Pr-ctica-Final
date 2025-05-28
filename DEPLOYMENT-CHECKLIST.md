# ✅ CHECKLIST DE DEPLOYMENT

## 📋 Antes del deployment

### 1. Configuración de GitHub Secrets
- [ ] `AZURE_WEBAPP_BACKEND_NAME` configurado como: `sapitos`
- [ ] `AZURE_WEBAPP_BACKEND_PUBLISH_PROFILE` configurado como: `$sapitos:1UcGLc06KzkYV2dCNWtn64dUXFudgfXHLZgzboxtnRz4vG1doitgj6NU5eqh`

### 2. Estructura del proyecto
- [ ] Carpeta `client/` con código del frontend React
- [ ] Carpeta `server/` con código del backend Node.js
- [ ] Archivo `client/package.json` con script `build`
- [ ] Archivo `server/package.json` con script `start`
- [ ] Archivo `.env` en server/ (solo para desarrollo local)

### 3. Dependencias
- [ ] Frontend tiene todas las dependencias en `client/package.json`
- [ ] Backend tiene todas las dependencias en `server/package.json`
- [ ] Ambos directorios tienen `package-lock.json`

## 🧪 Pruebas locales

### 1. Test de build del frontend
```bash
cd client
npm install
npm run build
```
- [ ] El build se ejecuta sin errores
- [ ] Se crea la carpeta `client/build/`

### 2. Test de backend
```bash
cd server
npm install
npm start
```
- [ ] El servidor inicia sin errores
- [ ] Se conecta a la base de datos

### 3. Test de deployment local
```bash
./test-deployment.bat
```
- [ ] Se ejecuta sin errores
- [ ] Se crea `backend.zip`
- [ ] Se crea `server/public/` con archivos del frontend

## 🚀 Activar CI/CD

### 1. Push a GitHub
```bash
git add .
git commit -m "Setup CI/CD pipeline"
git push origin main
```

### 2. Verificar en GitHub Actions
- [ ] Ve a tu repositorio → Actions
- [ ] Verifica que el workflow "Deploy Backend and Frontend to Azure" se ejecute
- [ ] Todos los steps deben completarse en verde ✅

### 3. Verificar deployment
- [ ] Visita https://sapitos.azurewebsites.net
- [ ] La aplicación carga correctamente
- [ ] El frontend y backend funcionan juntos

## 🔍 Cómo saber si funciona

### ✅ Señales de éxito:
1. **GitHub Actions**: Workflow completo en verde
2. **Azure**: Aplicación accesible en https://sapitos.azurewebsites.net
3. **Frontend**: Interfaz carga correctamente
4. **Backend**: APIs responden correctamente
5. **Base de datos**: Conexión exitosa

### ❌ Señales de problemas:
1. **Workflow falla**: Revisa los logs en GitHub Actions
2. **App no carga**: Verifica los secretos de GitHub
3. **Error 500**: Problema en el backend o base de datos
4. **Archivos no encontrados**: Problema en el build del frontend

## 🆘 Troubleshooting

### Si el workflow falla:
1. Verifica que los secretos estén bien configurados
2. Revisa los logs del step que falló
3. Ejecuta `test-deployment.bat` localmente para debug

### Si la app no carga:
1. Verifica https://sapitos.azurewebsites.net
2. Revisa los logs de Azure App Service
3. Verifica que las variables de entorno estén en Azure

### Si hay errores de CORS:
1. Verifica que `ALLOWED_ORIGINS` incluya tu frontend URL
2. Asegúrate que esté configurado en Azure App Service
