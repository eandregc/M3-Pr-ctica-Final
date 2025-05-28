@echo off
echo =================================
echo  PRUEBA LOCAL DE DEPLOYMENT
echo =================================

echo.
echo [1/4] Instalando dependencias del backend...
cd server
call npm install
if %ERRORLEVEL% neq 0 (
    echo ERROR: Fallo al instalar dependencias del backend
    pause
    exit /b 1
)

echo.
echo [2/4] Instalando dependencias del frontend...
cd ..\client
call npm install
if %ERRORLEVEL% neq 0 (
    echo ERROR: Fallo al instalar dependencias del frontend
    pause
    exit /b 1
)

echo.
echo [3/4] Construyendo el frontend...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ERROR: Fallo al construir el frontend
    pause
    exit /b 1
)

echo.
echo [4/4] Preparando backend para deployment...
cd ..
mkdir server\public 2>nul
xcopy /E /Y client\build\* server\public\
if %ERRORLEVEL% neq 0 (
    echo ERROR: Fallo al copiar archivos del frontend
    pause
    exit /b 1
)

echo.
echo [WEB.CONFIG] Creando web.config para Azure...
echo ^<?xml version="1.0" encoding="utf-8"?^> > server\web.config
echo ^<configuration^> >> server\web.config
echo   ^<system.webServer^> >> server\web.config
echo     ^<handlers^> >> server\web.config
echo       ^<add name="iisnode" path="index.js" verb="*" modules="iisnode"/^> >> server\web.config
echo     ^</handlers^> >> server\web.config
echo     ^<rewrite^> >> server\web.config
echo       ^<rules^> >> server\web.config
echo         ^<rule name="StaticContent"^> >> server\web.config
echo           ^<action type="Rewrite" url="public{REQUEST_URI}"/^> >> server\web.config
echo         ^</rule^> >> server\web.config
echo         ^<rule name="DynamicContent"^> >> server\web.config
echo           ^<conditions^> >> server\web.config
echo             ^<add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/^> >> server\web.config
echo           ^</conditions^> >> server\web.config
echo           ^<action type="Rewrite" url="index.js"/^> >> server\web.config
echo         ^</rule^> >> server\web.config
echo       ^</rules^> >> server\web.config
echo     ^</rewrite^> >> server\web.config
echo     ^<iisnode watchedFiles="web.config;*.js"/^> >> server\web.config
echo   ^</system.webServer^> >> server\web.config
echo ^</configuration^> >> server\web.config

echo.
echo [ZIP] Limpiando archivos anteriores...
if exist backend.zip del backend.zip

echo.
echo [ZIP] Comprimiendo backend...
powershell -Command "Compress-Archive -Path 'server\*' -DestinationPath 'backend.zip' -Force"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Fallo al comprimir el backend
    pause
    exit /b 1
)

echo.
echo =================================
echo   DEPLOYMENT PREPARADO EXITOSAMENTE
echo =================================
echo.
echo Archivos generados:
echo - backend.zip (listo para subir a Azure)
echo - server/public/ (contiene el frontend)
echo - server/web.config (configuracion para Azure)
echo.
echo Para deployment manual, ejecuta:
echo curl -X POST "https://sapitos.scm.azurewebsites.net/api/zipdeploy" --user "$sapitos:1UcGLc06KzkYV2dCNWtn64dUXFudgfXHLZgzboxtnRz4vG1doitgj6NU5eqh" --data-binary @"backend.zip"
echo.
pause
