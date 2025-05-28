const { createMascota, getMascotasByUser } = require('../controllers/mascotaController');
const { poolPromise } = require('../config/db');

describe('MascotaController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn()
    };
    
    jest.clearAllMocks();
  });

  describe('createMascota', () => {
    test('debe crear una mascota exitosamente', async () => {
      req.body = {
        nombre: 'Firulais',
        especie: 'Perro',
        raza: 'Labrador',
        edad: 3,
        peso: 25.5,
        cliente_id: 1
      };

      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({})
      };
      
      poolPromise.request = jest.fn().mockResolvedValue(mockRequest);

      await createMascota(req, res);

      expect(mockRequest.input).toHaveBeenCalledWith('nombre', expect.any(String), 'Firulais');
      expect(mockRequest.input).toHaveBeenCalledWith('especie', expect.any(String), 'Perro');
      expect(mockRequest.input).toHaveBeenCalledWith('raza', expect.any(String), 'Labrador');
      expect(mockRequest.input).toHaveBeenCalledWith('edad', expect.any(String), 3);
      expect(mockRequest.input).toHaveBeenCalledWith('peso', expect.any(String), 25.5);
      expect(mockRequest.input).toHaveBeenCalledWith('cliente_id', expect.any(String), 1);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith('Mascota registrada');
    });

    test('debe manejar errores de base de datos al crear mascota', async () => {
      req.body = {
        nombre: 'Firulais',
        especie: 'Perro',
        raza: 'Labrador',
        edad: 3,
        peso: 25.5,
        cliente_id: 1
      };

      poolPromise.request = jest.fn().mockRejectedValue(new Error('Database error'));

      await createMascota(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error al registrar mascota');
    });
  });

  describe('getMascotasByUser', () => {
    test('debe obtener mascotas del usuario cliente', async () => {
      req.user = { id: 1, rol: 'cliente' };

      const mockMascotas = [
        {
          id: 1,
          nombre: 'Firulais',
          especie: 'Perro',
          raza: 'Labrador',
          edad: 3,
          peso: 25.5
        },
        {
          id: 2,
          nombre: 'Michi',
          especie: 'Gato',
          raza: 'Siamés',
          edad: 2,
          peso: 4.2
        }
      ];

      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: mockMascotas })
      };
      
      poolPromise.request = jest.fn().mockResolvedValue(mockRequest);

      await getMascotasByUser(req, res);

      expect(mockRequest.input).toHaveBeenCalledWith('userId', expect.any(String), 1);
      expect(res.json).toHaveBeenCalledWith(mockMascotas);
    });

    test('debe retornar 403 si el usuario no es cliente', async () => {
      req.user = { id: 1, rol: 'veterinario' };

      await getMascotasByUser(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith('Solo los clientes pueden ver sus mascotas');
    });

    test('debe manejar errores de base de datos al obtener mascotas', async () => {
      req.user = { id: 1, rol: 'cliente' };

      poolPromise.request = jest.fn().mockRejectedValue(new Error('Database error'));

      await getMascotasByUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error al obtener mascotas');
    });

    test('debe retornar array vacío si el cliente no tiene mascotas', async () => {
      req.user = { id: 1, rol: 'cliente' };

      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [] })
      };
      
      poolPromise.request = jest.fn().mockResolvedValue(mockRequest);

      await getMascotasByUser(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
    });
  });
});
