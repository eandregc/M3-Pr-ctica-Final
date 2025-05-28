const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { login } = require('../controllers/authController');

// Mock de bcrypt
jest.mock('bcrypt');
// Mock de jwt
jest.mock('jsonwebtoken');

// Mock completo de la base de datos
const mockRequest = {
  input: jest.fn().mockReturnThis(),
  query: jest.fn()
};

const mockPool = {
  request: jest.fn().mockReturnValue(mockRequest)
};

// Mock poolPromise
jest.mock('../config/db', () => ({
  poolPromise: Promise.resolve(mockPool),
  sql: {
    NVarChar: 'NVarChar',
    Int: 'Int',
    DateTime: 'DateTime',
    Decimal: 'Decimal'
  }
}));

describe('AuthController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn()
    };
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('login', () => {
    test('debe retornar 404 si el usuario no existe', async () => {
      req.body = {
        correo: 'usuario@inexistente.com',
        contrasena: 'password123'
      };

      mockRequest.query.mockResolvedValue({ recordset: [] });

      await login(req, res);

      expect(mockRequest.input).toHaveBeenCalledWith('correo', 'NVarChar', 'usuario@inexistente.com');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Usuario no encontrado');
    });

    test('debe retornar 401 si la contraseña es incorrecta', async () => {
      req.body = {
        correo: 'usuario@test.com',
        contrasena: 'passwordIncorrecto'
      };

      const mockUser = {
        id: 1,
        correo: 'usuario@test.com',
        contrasena_hash: 'hashedpassword',
        rol: 'cliente'
      };

      mockRequest.query.mockResolvedValue({ recordset: [mockUser] });
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith('passwordIncorrecto', 'hashedpassword');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('Contraseña incorrecta');
    });

    test('debe retornar token si las credenciales son correctas', async () => {
      req.body = {
        correo: 'usuario@test.com',
        contrasena: 'passwordCorrecto'
      };

      const mockUser = {
        id: 1,
        correo: 'usuario@test.com',
        contrasena_hash: 'hashedpassword',
        rol: 'cliente'
      };

      const mockToken = 'fake-jwt-token';

      mockRequest.query.mockResolvedValue({ recordset: [mockUser] });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      await login(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith('passwordCorrecto', 'hashedpassword');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1, rol: 'cliente' },
        'test-secret-key',
        { expiresIn: '1d' }
      );
      expect(res.json).toHaveBeenCalledWith({
        token: mockToken,
        rol: 'cliente'
      });
    });

    test('debe manejar errores de base de datos', async () => {
      req.body = {
        correo: 'usuario@test.com',
        contrasena: 'password123'
      };

      mockPool.request.mockImplementation(() => {
        throw new Error('Database connection failed');
      });

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error en login');
    });

    test('debe validar campos requeridos', async () => {
      req.body = {
        correo: '',
        contrasena: ''
      };

      mockRequest.query.mockResolvedValue({ recordset: [] });

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Usuario no encontrado');
    });

    test('debe funcionar con usuario veterinario', async () => {
      req.body = {
        correo: 'veterinario@test.com',
        contrasena: 'vetPassword123'
      };

      const mockUser = {
        id: 2,
        correo: 'veterinario@test.com',
        contrasena_hash: 'hashedvetpassword',
        rol: 'veterinario'
      };

      const mockToken = 'vet-jwt-token';

      mockRequest.query.mockResolvedValue({ recordset: [mockUser] });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      await login(req, res);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 2, rol: 'veterinario' },
        'test-secret-key',
        { expiresIn: '1d' }
      );
      expect(res.json).toHaveBeenCalledWith({
        token: mockToken,
        rol: 'veterinario'
      });
    });
  });
});
