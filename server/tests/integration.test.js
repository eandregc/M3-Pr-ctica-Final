const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Mock de todas las dependencias
jest.mock('../config/db');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const authRoutes = require('../routes/authRoutes');
const mascotaRoutes = require('../routes/mascotaRoutes');
const citaRoutes = require('../routes/citaRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/mascotas', mascotaRoutes);
app.use('/citas', citaRoutes);

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('API Health Check', () => {
    test('debe responder a solicitudes básicas', async () => {
      // Test básico de conectividad
      const response = await request(app)
        .get('/auth/login')
        .expect(404); // Esperamos 404 porque login requiere POST

      expect(response.status).toBe(404);
    });
  });

  describe('Error Handling', () => {
    test('debe manejar rutas no encontradas', async () => {
      await request(app)
        .get('/ruta-inexistente')
        .expect(404);
    });

    test('debe manejar JSON malformado', async () => {
      await request(app)
        .post('/auth/login')
        .send('invalid json')
        .expect(400);
    });
  });

  describe('CORS Configuration', () => {
    test('debe incluir headers CORS', async () => {
      const response = await request(app)
        .options('/auth/login')
        .expect(204);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});
