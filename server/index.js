const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sql = require('mssql');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'public')));

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const dbConfig = {
    user: 'db_a25c05_sapitos_admin',
    password: 'momju6-baTnax-rusxyq',
    server: 'sql8020.site4now.net',
    database: 'db_a25c05_sapitos',
    options: { encrypt: true }
};

const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('Conectado a SQL Server');
        return pool;
    })
    .catch(err => console.log('Error al conectar DB:', err));

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token requerido');
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('Token inválido');
        req.user = decoded;
        next();
    });
};

app.post('/api/login', async (req, res) => {
    const { correo, contrasena } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('correo', sql.NVarChar, correo)
            .query('SELECT * FROM Usuarios WHERE correo = @correo');

        if (result.recordset.length === 0) return res.status(404).send('Usuario no encontrado');

        const user = result.recordset[0];
        const isValid = await bcrypt.compare(contrasena, user.contrasena_hash);
        if (!isValid) return res.status(401).send('Contraseña incorrecta');

        const token = jwt.sign({ id: user.id, rol: user.rol }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, rol: user.rol, nombre: user.nombre });
    } catch (err) {
        res.status(500).send('Error en login');
    }
});

app.post('/api/register', async (req, res) => {
    const { nombre, correo, contrasena, rol } = req.body;
    try {
        const hash = await bcrypt.hash(contrasena, 10);
        const pool = await poolPromise;
        await pool.request()
            .input('nombre', sql.NVarChar, nombre)
            .input('correo', sql.NVarChar, correo)
            .input('contrasena_hash', sql.NVarChar, hash)
            .input('rol', sql.NVarChar, rol)
            .query('INSERT INTO Usuarios (nombre, correo, contrasena_hash, rol) VALUES (@nombre, @correo, @contrasena_hash, @rol)');
        res.status(201).send('Usuario registrado');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al registrar usuario');
    }
});

// Importar y usar las rutas de citas desde citaRoutes.js
const citaRoutes = require('./routes/citaRoutes');
app.use('/api/citas', citaRoutes);

app.post('/api/mascotas', verifyToken, async (req, res) => {
    const { nombre, especie, raza, edad, peso, cliente_id } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('nombre', sql.NVarChar, nombre)
            .input('especie', sql.NVarChar, especie)
            .input('raza', sql.NVarChar, raza)
            .input('edad', sql.Int, edad)
            .input('peso', sql.Decimal, peso)
            .input('cliente_id', sql.Int, cliente_id)
            .query(`INSERT INTO Mascotas (nombre, especie, raza, edad, peso, cliente_id)
                    VALUES (@nombre, @especie, @raza, @edad, @peso, @cliente_id)`);
        res.status(201).send('Mascota registrada');
    } catch (err) {
        res.status(500).send('Error al registrar mascota');
    }
});

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
