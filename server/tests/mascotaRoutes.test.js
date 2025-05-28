const request = require('supertest');
const express = require('express');
const mascotaRoutes = require('../routes/mascotaRoutes');
const { createMascota, getMascotasByUser } = require('../controllers/mascotaController');
const verifyToken = require('../middleware/authMiddleware');

// Mock del controlador y middleware
jest.mock('../controllers/mascotaController');
jest.mock('../middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use('/mascotas', mascotaRoutes);

describe('MascotaRoutes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock del middleware de autenticación
    verifyToken.mockImplementation((req, res, next) => {
      req.user = { id: 1, rol: 'cliente' };
      next();
    });
  });

  test('POST /mascotas debe crear una mascota', async () => {
    const mockMascotaData = {
      nombre: 'Firulais',
      especie: 'Perro',
      raza: 'Labrador',
      edad: 3,
      peso: 25.5,
      cliente_id: 1
    };

    createMascota.mockImplementation((req, res) => {
      res.status(201).json({
        message: 'Mascota registrada exitosamente',
        id: 1
      });
    });

    const response = await request(app)
      .post('/mascotas')
      .send(mockMascotaData)
      .expect(201);

    expect(createMascota).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual({
      message: 'Mascota registrada exitosamente',
      id: 1
    });
  });

  test('GET /mascotas debe obtener mascotas del usuario', async () => {
    const mockMascotas = [
      {
        id: 1,
        nombre: 'Firulais',
        especie: 'Perro',
        raza: 'Labrador',
        edad: 3,
        peso: 25.5
      }
    ];

    getMascotasByUser.mockImplementation((req, res) => {
      res.json(mockMascotas);
    });

    const response = await request(app)
      .get('/mascotas')
      .expect(200);

    expect(getMascotasByUser).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(mockMascotas);
  });

  test('debe requerir autenticación para todas las rutas', async () => {
    // Simular falta de autenticación
    verifyToken.mockImplementation((req, res) => {
      res.status(403).send('Token requerido');
    });

    await request(app)
      .get('/mascotas')
      .expect(403);

    await request(app)
      .post('/mascotas')
      .send({})
      .expect(403);
  });
});
