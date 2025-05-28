const { getCitas, crearCita, eliminarCita, editarCita } = require('../controllers/citaController');
const { poolPromise } = require('../config/db');

describe('CitaController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn()
    };
    
    jest.clearAllMocks();
  });

  describe('getCitas', () => {
    test('debe obtener citas para veterinario/admin', async () => {
      req.user = { id: 1, rol: 'veterinario' };

      const mockCitas = [
        {
          id: 1,
          fecha: '2024-01-15T10:00:00.000Z',
          motivo: 'Consulta general',
          mascota_nombre: 'Firulais',
          cliente_nombre: 'Juan Pérez'
        }
      ];

      const mockRequest = {
        query: jest.fn().mockResolvedValue({ recordset: mockCitas })
      };
      
      poolPromise.request = jest.fn().mockResolvedValue(mockRequest);

      await getCitas(req, res);

      expect(res.json).toHaveBeenCalledWith(mockCitas);
    });

    test('debe obtener citas para cliente', async () => {
      req.user = { id: 1, rol: 'cliente' };

      const mockCitas = [
        {
          id: 1,
          fecha: '2024-01-15T10:00:00.000Z',
          motivo: 'Vacunación',
          mascota_nombre: 'Michi'
        }
      ];

      const mockRequest = {
        query: jest.fn().mockResolvedValue({ recordset: mockCitas })
      };
      
      poolPromise.request = jest.fn().mockResolvedValue(mockRequest);

      await getCitas(req, res);

      expect(res.json).toHaveBeenCalledWith(mockCitas);
    });

    test('debe retornar 403 para rol no permitido', async () => {
      req.user = { id: 1, rol: 'rolInvalido' };

      await getCitas(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith('Rol no permitido');
    });    test('debe manejar errores de base de datos', async () => {
      req.user = { id: 1, rol: 'veterinario' };

      const mockError = new Error('Database connection failed');
      poolPromise.then = jest.fn((callback, errorCallback) => {
        if (errorCallback) errorCallback(mockError);
        return Promise.reject(mockError);
      });

      await getCitas(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error al obtener citas');
    });
  });

  describe('crearCita', () => {
    test('debe crear una cita exitosamente', async () => {
      req.body = {
        mascota_id: 1,
        fecha: '2024-01-15T10:00:00.000Z',
        motivo: 'Consulta general'
      };
      req.user = { id: 1, rol: 'cliente' };

      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [] })
      };
      
      poolPromise.request = jest.fn().mockResolvedValue(mockRequest);

      await crearCita(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith('Cita creada con éxito');
    });

    test('debe retornar 403 para usuario no autorizado', async () => {
      req.body = {
        mascota_id: 1,
        fecha: '2024-01-15T10:00:00.000Z',
        motivo: 'Consulta general'
      };
      req.user = { id: 1, rol: 'veterinario' };

      await crearCita(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith('No autorizado para crear citas');
    });

    test('debe retornar 400 si la fecha ya está ocupada', async () => {
      req.body = {
        mascota_id: 1,
        fecha: '2024-01-15T10:00:00.000Z',
        motivo: 'Consulta general'
      };
      req.user = { id: 1, rol: 'cliente' };

      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [{ id: 1 }] })
      };
      
      poolPromise.request = jest.fn().mockResolvedValue(mockRequest);

      await crearCita(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Esta hora ya está reservada');
    });
  });

  describe('eliminarCita', () => {
    test('debe eliminar cita como veterinario', async () => {
      req.params = { id: '1' };
      req.user = { id: 1, rol: 'veterinario' };

      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [{ id: 1 }] })
      };
      
      poolPromise.request = jest.fn().mockResolvedValue(mockRequest);

      await eliminarCita(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Cita eliminada con éxito');
    });

    test('debe retornar 403 si no tiene permisos', async () => {
      req.params = { id: '1' };
      req.user = { id: 1, rol: 'cliente' };

      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [] })
      };
      
      poolPromise.request = jest.fn().mockResolvedValue(mockRequest);

      await eliminarCita(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith('No autorizado para eliminar esta cita');
    });
  });

  describe('editarCita', () => {
    test('debe editar cita como veterinario', async () => {
      req.params = { id: '1' };
      req.body = {
        fecha: '2024-01-16T10:00:00.000Z',
        motivo: 'Consulta de seguimiento'
      };
      req.user = { id: 1, rol: 'veterinario' };

      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [{ id: 1 }] })
      };
      
      poolPromise.request = jest.fn().mockResolvedValue(mockRequest);

      await editarCita(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Cita actualizada con éxito');
    });

    test('debe retornar 403 si no tiene permisos para editar', async () => {
      req.params = { id: '1' };
      req.body = {
        fecha: '2024-01-16T10:00:00.000Z',
        motivo: 'Consulta de seguimiento'
      };
      req.user = { id: 1, rol: 'cliente' };

      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [] })
      };
      
      poolPromise.request = jest.fn().mockResolvedValue(mockRequest);

      await editarCita(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith('No autorizado para editar esta cita');
    });
  });
});
