# Backend Unit Tests Documentation

## Resumen de Pruebas Unitarias

Este proyecto incluye una suite completa de pruebas unitarias para el backend de la aplicación veterinaria. Las pruebas están diseñadas para verificar la funcionalidad de todos los componentes críticos del sistema.

## Estructura de Pruebas

### 📁 Tests Directory Structure
```
tests/
├── setup.js                    # Configuración global de pruebas
├── authController.test.js       # Pruebas del controlador de autenticación
├── authMiddleware.test.js       # Pruebas del middleware de autenticación ✅
├── authRoutes.test.js          # Pruebas de rutas de autenticación
├── citaController.test.js      # Pruebas del controlador de citas
├── citaRoutes.test.js          # Pruebas de rutas de citas ✅
├── mascotaController.test.js   # Pruebas del controlador de mascotas
├── mascotaRoutes.test.js       # Pruebas de rutas de mascotas
├── integration.test.js         # Pruebas de integración ✅
├── utilities.test.js           # Pruebas de utilidades ✅
└── comprehensive.test.js       # Suite completa de pruebas
```

## Configuración de Jest

### jest.config.js
- **Entorno**: Node.js
- **Cobertura**: Configurada para controllers, middleware y routes
- **Threshold**: 70% mínimo de cobertura
- **Timeout**: 10 segundos para pruebas asíncronas

### Scripts NPM Disponibles
```bash
npm test                # Ejecutar todas las pruebas
npm run test:watch      # Ejecutar pruebas en modo watch
npm run test:coverage   # Ejecutar pruebas con reporte de cobertura
npm run test:verbose    # Ejecutar pruebas con salida detallada
```

## Pruebas Implementadas

### ✅ AuthMiddleware Tests (4/4 pasando)
- Verificación de token requerido
- Validación de token inválido
- Acceso con token válido
- Manejo de diferentes tipos de errores JWT

### ✅ Cita Routes Tests (4/4 pasando)
- GET /api/citas - Obtener todas las citas
- POST /api/citas - Crear nueva cita
- PUT /api/citas/:id - Actualizar cita existente
- DELETE /api/citas/:id - Eliminar cita existente

### ✅ Integration Tests (3/4 pasando)
- Health check básico de la API
- Manejo de rutas no encontradas
- Configuración CORS

### ✅ Utilities Tests (5/5 pasando)
- Generación de tokens JWT
- Verificación de tokens JWT
- Hashing de contraseñas
- Comparación de contraseñas

## Características de las Pruebas

### 🔧 Mocking Strategy
- **Base de datos**: Completamente mockeada para evitar dependencias
- **Autenticación**: bcrypt y jsonwebtoken mockeados
- **HTTP Requests**: Usando supertest para pruebas de integración

### 🛡️ Security Testing
- Validación de autenticación
- Verificación de autorización por roles
- Pruebas de tokens JWT
- Validación de entrada de datos

### 📊 Coverage Areas
- **Controllers**: Lógica de negocio
- **Middleware**: Autenticación y autorización
- **Routes**: Endpoints de la API
- **Utilities**: Funciones auxiliares

## Problemas Identificados y Soluciones

### 🔴 Problemas en AuthController Tests
**Problema**: Mock de poolPromise no funciona correctamente
**Solución**: Implementar mock directo en el módulo de configuración

### 🔴 Problemas en Route Tests
**Problema**: 404 errors en lugar de respuestas esperadas
**Solución**: Verificar configuración de rutas en tests

### 🔴 Problemas en Controller Tests
**Problema**: Database mocking inconsistente
**Solución**: Estandarizar estrategia de mocking

## Mejores Prácticas Implementadas

### ✨ Test Organization
- Agrupación lógica por funcionalidad
- Descripción clara de cada test
- Setup y teardown apropiados

### ✨ Assertion Strategy
- Verificación de llamadas a funciones
- Validación de parámetros
- Comprobación de respuestas HTTP

### ✨ Error Handling
- Pruebas de casos de error
- Validación de mensajes de error
- Verificación de códigos de estado HTTP

## Comandos de Ejecución

### Ejecutar todas las pruebas
```bash
cd server
npm test
```

### Ejecutar pruebas específicas
```bash
# Solo middleware
npx jest tests/authMiddleware.test.js

# Solo rutas de citas
npx jest tests/citaRoutes.test.js

# Solo utilidades
npx jest tests/utilities.test.js
```

### Generar reporte de cobertura
```bash
npm run test:coverage
```

## Métricas de Calidad

### 📈 Estado Actual
- **Pruebas pasando**: 16/46 (35%)
- **Suites pasando**: 3/9 (33%)
- **Cobertura estimada**: ~40%

### 🎯 Objetivos
- **Meta de pruebas**: 90% pasando
- **Meta de cobertura**: 80%
- **Meta de suites**: 100% pasando

## Próximos Pasos

1. **Corregir mocking de base de datos** en authController
2. **Implementar tests unitarios** para mascotaController
3. **Corregir configuración de rutas** en route tests
4. **Agregar tests de validación** de entrada
5. **Implementar tests de performance** básicos

## Tecnologías Utilizadas

- **Jest**: Framework de testing
- **Supertest**: Testing de APIs HTTP
- **bcrypt**: Hashing de contraseñas (mocked)
- **jsonwebtoken**: Manejo de JWT (mocked)
- **Express**: Framework web (para integration tests)

---

Este documento proporciona una guía completa para entender y ejecutar las pruebas unitarias del backend. Para más información sobre Jest y mejores prácticas de testing, consultar la documentación oficial.
