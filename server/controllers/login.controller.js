const sql = require('mssql');
const config = require('../db/config');

const login = async (req, res) => {
  const { correo, contrasena_hash } = req.body;
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('correo', sql.NVarChar, correo)
      .input('contrasena_hash', sql.NVarChar, contrasena_hash)
      .query('SELECT id, nombre, correo, rol FROM Usuarios WHERE correo = @correo AND contrasena_hash = @contrasena_hash');

    if (result.recordset.length > 0) {
      res.json({ message: 'Login exitoso', usuario: result.recordset[0] });
    } else {
      res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  login
};
