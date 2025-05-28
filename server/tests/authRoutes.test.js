const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const { login } = require('../controllers/authController');

// Mock del controlador
jest.mock('../controllers/authController');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('AuthRoutes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /auth/login debe llamar al controlador de login', async () => {
    const mockLoginData = {
      correo: 'test@test.com',
      contrasena: 'password123'
    };

    login.mockImplementation((req, res) => {
      res.json({ token: 'fake-token', rol: 'cliente' });
    });

    const response = await request(app)
      .post('/auth/login')
      .send(mockLoginData)
      .expect(200);

    expect(login).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual({
      token: 'fake-token',
      rol: 'cliente'
    });
  });

  test('POST /auth/login debe manejar errores del controlador', async () => {
    const mockLoginData = {
      correo: 'test@test.com',
      contrasena: 'wrongpassword'
    };

    login.mockImplementation((req, res) => {
      res.status(401).send('Contraseña incorrecta');
    });

    await request(app)
      .post('/auth/login')
      .send(mockLoginData)
      .expect(401);

    expect(login).toHaveBeenCalledTimes(1);
  });

  test('POST /auth/login debe validar formato JSON', async () => {
    await request(app)
      .post('/auth/login')
      .send('invalid json')
      .expect(400);
  });
});
