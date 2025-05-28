const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Tests para utilidades de autenticación
describe('Auth Utilities', () => {
  describe('JWT Token Generation', () => {
    test('debe generar token válido', () => {
      const payload = { id: 1, rol: 'cliente' };
      const secret = 'test-secret';
      const options = { expiresIn: '1d' };

      const token = jwt.sign(payload, secret, options);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT tiene 3 partes
    });

    test('debe verificar token válido', () => {
      const payload = { id: 1, rol: 'cliente' };
      const secret = 'test-secret';
      
      const token = jwt.sign(payload, secret);
      const decoded = jwt.verify(token, secret);
      
      expect(decoded.id).toBe(payload.id);
      expect(decoded.rol).toBe(payload.rol);
    });

    test('debe fallar con token inválido', () => {
      const invalidToken = 'invalid.token.here';
      const secret = 'test-secret';
      
      expect(() => {
        jwt.verify(invalidToken, secret);
      }).toThrow();
    });
  });

  describe('Password Hashing', () => {
    test('debe hashear contraseña correctamente', async () => {
      const password = 'password123';
      const saltRounds = 10;
      
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(password.length);
    });

    test('debe comparar contraseñas correctamente', async () => {
      const password = 'password123';
      const wrongPassword = 'wrongpassword';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const isValidPassword = await bcrypt.compare(password, hashedPassword);
      const isInvalidPassword = await bcrypt.compare(wrongPassword, hashedPassword);
      
      expect(isValidPassword).toBe(true);
      expect(isInvalidPassword).toBe(false);
    });
  });
});
