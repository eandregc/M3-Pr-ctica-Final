const request = require('supertest');
const express = require('express');
const citaRoutes = require('../routes/citaRoutes');

// Mock del middleware de autenticación
jest.mock('../middleware/authMiddleware', () => {
  return (req, res, next) => {
    req.user = { id: 1, rol: 'veterinario' };
    next();
  };
});

// Mock de los controladores
jest.mock('../controllers/citaController', () => ({
  getCitas: jest.fn((req, res) => {
    res.json([{ id: 1, fecha: '2024-01-15T10:00:00.000Z', motivo: 'Test' }]);
  }),
  crearCita: jest.fn((req, res) => {
    res.status(201).send('Cita creada con éxito');
  }),
  editarCita: jest.fn((req, res) => {
    res.status(200).send('Cita actualizada con éxito');
  }),
  eliminarCita: jest.fn((req, res) => {
    res.status(200).send('Cita eliminada con éxito');
  })
}));

describe('Cita Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/citas', citaRoutes);
  });

  describe('GET /api/citas', () => {
    test('debe obtener todas las citas', async () => {
      const response = await request(app)
        .get('/api/citas')
        .expect(200);

      expect(response.body).toEqual([
        { id: 1, fecha: '2024-01-15T10:00:00.000Z', motivo: 'Test' }
      ]);
    });
  });

  describe('POST /api/citas', () => {
    test('debe crear una nueva cita', async () => {
      const nuevaCita = {
        mascota_id: 1,
        fecha: '2024-01-15T10:00:00.000Z',
        motivo: 'Consulta general'
      };

      const response = await request(app)
        .post('/api/citas')
        .send(nuevaCita)
        .expect(201);

      expect(response.text).toBe('Cita creada con éxito');
    });
  });

  describe('PUT /api/citas/:id', () => {
    test('debe actualizar una cita existente', async () => {
      const citaActualizada = {
        fecha: '2024-01-16T10:00:00.000Z',
        motivo: 'Consulta de seguimiento'
      };

      const response = await request(app)
        .put('/api/citas/1')
        .send(citaActualizada)
        .expect(200);

      expect(response.text).toBe('Cita actualizada con éxito');
    });
  });

  describe('DELETE /api/citas/:id', () => {
    test('debe eliminar una cita existente', async () => {
      const response = await request(app)
        .delete('/api/citas/1')
        .expect(200);

      expect(response.text).toBe('Cita eliminada con éxito');
    });
  });
});
