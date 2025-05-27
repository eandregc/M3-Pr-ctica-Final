# Sistema de Gestión Veterinaria "Sapitos"

Este proyecto es un sistema completo para la gestión de una clínica veterinaria que atiende todo tipo de animales, desde mascotas tradicionales hasta especies exóticas. Desarrollado con React en el frontend y Express/Node.js en el backend.

## 🚀 Deployment en Azure

**¡Tu aplicación está configurada con GitHub Continuous Deployment!** 

### ✅ Secrets ya configurados:
- Azure Client ID, Subscription ID y Tenant ID están listos

### 📋 Pasos restantes:
1. **Agregar secrets faltantes** en GitHub:
   - `AZURE_CLIENT_SECRET` (obtenerlo de Azure Portal)
   - `AZURE_WEBAPP_NAME` (nombre de tu Web App)

2. **Activar deployment**: Haz push a `main`

### Scripts de configuración:
```powershell
.\setup-deployment.ps1  # Configuración completa
```

📖 **Para instrucciones detalladas, revisa [AZURE_DEPLOYMENT.md](./AZURE_DEPLOYMENT.md)**

## 💻 Desarrollo Local

### Configuración Rápida:
```powershell
# Instalar dependencias y preparar para desarrollo
.\setup-deployment.ps1

# Probar localmente
.\test-local.ps1

# Iniciar servidor
cd server
npm start
```

La aplicación estará disponible en `http://localhost:3001`

## Estructura del Proyecto

- `client/`: Aplicación frontend desarrollada con React
- `server/`: API backend desarrollada con Express/Node.js
- `.github/workflows/`: Pipelines de CI/CD para Azure

## Requisitos

- Node.js (versión 14 o superior)
- SQL Server (la base de datos está configurada en un servidor externo)
- Puertos disponibles: 3000 (backend) y 3001 (frontend)

## Características Principales

- Gestión de pacientes (animales de todas las especies)
- Historiales médicos completos
- Agenda de citas y seguimientos
- Control de inventario de medicamentos y suministros
- Panel administrativo para veterinarios y personal

## Configuración del Backend

1. Navegue a la carpeta `server`
2. Instale las dependencias:

```
npm install
```

3. El archivo `.env` ya está configurado con los siguientes valores:
   - Puerto: 3000
   - Credenciales de la base de datos SQL Server

4. Inicie el servidor:

```
npm run dev
```

## Configuración del Frontend

1. Navegue a la carpeta `client`
2. Instale las dependencias:

```
npm install
```

3. Inicie la aplicación:

```
npm start
```

> **Nota 1:** Si recibe el mensaje "Something is already running on port 3000", es porque el servidor backend ya está usando ese puerto. Tiene dos opciones:
> 
> **Opción 1:** Ejecute el cliente en un puerto diferente respondiendo "Yes" cuando se le pregunte:
> ```
> Would you like to run the app on another port instead? (Y/n)
> ```
> 
> **Opción 2:** Modifique el archivo `.env` del cliente para usar un puerto diferente:
> ```
> PORT=3001
> ```
>
> **Nota 2:** Si recibe el error "error:0308010C:digital envelope routines::unsupported", está relacionado con Node.js v18+ y OpenSSL. Tiene las siguientes opciones para solucionarlo:
>
> **Opción 1:** Ejecute el comando con una variable de entorno (recomendado para desarrollo):
> ```
> # En Windows (PowerShell)
> $env:NODE_OPTIONS="--openssl-legacy-provider"; npm start
>
> # En Windows (CMD)
> set NODE_OPTIONS=--openssl-legacy-provider && npm start
> ```
>
> **Opción 2:** Modifique el archivo package.json del cliente, cambiando la línea de "start":
> ```json
> "scripts": {
>   "start": "react-scripts --openssl-legacy-provider start",
>   ...
> }
> ```

## Autenticación

La aplicación utiliza JWT (JSON Web Tokens) para la autenticación. Al iniciar sesión, el servidor genera un token que se almacena en el localStorage del navegador y se envía con cada solicitud posterior.

## Rutas Principales

### Backend
- `/login`: Autenticación de usuarios (veterinarios y personal administrativo)
- `/users`: CRUD de usuarios del sistema
- `/users/profile`: Obtener información del perfil del usuario autenticado
- `/patients`: Gestión de pacientes animales
- `/appointments`: Gestión de citas veterinarias
- `/inventory`: Control de inventario de medicamentos y suministros

### Frontend
- `/login`: Página de inicio de sesión
- `/dashboard`: Panel principal con resumen de actividades
- `/patients`: Registro y gestión de pacientes animales
- `/appointments`: Calendario y gestión de citas
- `/inventory`: Control de medicamentos y suministros
- `/users`: Administración de personal (solo accesible para administradores)

## Roles de Usuario

- **Administrador**: Acceso completo al sistema
- **Veterinario**: Gestión de pacientes, historiales médicos y citas
- **Asistente**: Registro de pacientes, agenda de citas
- **Recepcionista**: Gestión de citas y registro básico

## Aspectos Técnicos

- Interfaz adaptada a la temática veterinaria con diseño responsivo
- Sistema de autenticación basado en JWT para garantizar la seguridad
- Base de datos optimizada para almacenar información específica veterinaria
- API RESTful para comunicación eficiente entre cliente y servidor

## Configuración de Puertos

- **Backend (API)**: Se ejecuta en el puerto 3000 por defecto (configurable en `server/.env`)
- **Frontend (Cliente)**: Se ejecuta en el puerto 3001 por defecto (configurable en `client/.env`)

Es importante mantener estos puertos diferentes para evitar conflictos. El cliente está configurado para comunicarse con la API en `http://localhost:3000` automáticamente.

## Inicio Rápido

Para facilitar el proceso de inicio de la aplicación, se incluyen scripts que automatizan la puesta en marcha tanto del servidor como del cliente:

### Usando el script de Windows

```
start-app.bat
```

### Usando PowerShell

```
.\start-app.ps1
```

Estos scripts iniciarán automáticamente el servidor backend y el cliente frontend con la configuración correcta para evitar problemas de compatibilidad con Node.js v18+.