const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/authMiddleware');

// Mock de jwt
jest.mock('jsonwebtoken');

describe('AuthMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
    
    jest.clearAllMocks();
  });

  test('debe retornar 403 si no hay token', () => {
    req.headers = {};

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('Token requerido');
    expect(next).not.toHaveBeenCalled();
  });

  test('debe retornar 401 si el token es inválido', () => {
    req.headers.authorization = 'invalid-token';
    
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Token inválido'), null);
    });

    verifyToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('invalid-token', 'test-secret-key', expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Token inválido');
    expect(next).not.toHaveBeenCalled();
  });

  test('debe permitir el acceso con token válido', () => {
    const mockDecoded = {
      id: 1,
      rol: 'cliente'
    };
    
    req.headers.authorization = 'valid-token';
    
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, mockDecoded);
    });

    verifyToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret-key', expect.any(Function));
    expect(req.user).toEqual(mockDecoded);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  test('debe manejar diferentes tipos de errores JWT', () => {
    req.headers.authorization = 'expired-token';
    
    jwt.verify.mockImplementation((token, secret, callback) => {
      const error = new Error('jwt expired');
      error.name = 'TokenExpiredError';
      callback(error, null);
    });

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Token inválido');
    expect(next).not.toHaveBeenCalled();
  });
});
