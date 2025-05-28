// Configuración global para las pruebas
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';

// Configurar timeouts globales para evitar problemas
jest.setTimeout(10000);

// Mock de la base de datos para evitar conexiones reales durante las pruebas
jest.mock('../config/db', () => ({
  poolPromise: Promise.resolve({
    request: jest.fn(() => ({
      input: jest.fn().mockReturnThis(),
      query: jest.fn()
    }))
  }),
  sql: {
    NVarChar: 'NVarChar',
    Int: 'Int',
    DateTime: 'DateTime',
    Decimal: 'Decimal'
  }
}));

// Suprimir logs durante las pruebas
console.log = jest.fn();
console.error = jest.fn();
