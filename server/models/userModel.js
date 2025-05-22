const bcrypt = require('bcrypt');
const sql = require('mssql');

// Crear usuario con contraseña hasheada
const createUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  await sql.connect(/* configuración de SQL Server */);
  const result = await sql.query`
    INSERT INTO Users (username, password)
    VALUES (${username}, ${hashedPassword})
  `;
  
  return result;
};

// Obtener usuario por username
const getUserByUsername = async (username) => {
  await sql.connect(/* configuración SQL */);
  const result = await sql.query`
    SELECT * FROM Users WHERE username = ${username}
  `;
  
  return result.recordset[0];
};

module.exports = { createUser, getUserByUsername };