const { poolPromise, sql } = require('../config/db');

exports.createMascota = async (req, res) => {
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
        console.error(err);
        res.status(500).send('Error al registrar mascota');
    }
};

exports.getMascotasByUser = async (req, res) => {
    const { id, rol } = req.user;
    
    if (rol !== 'cliente') {
        return res.status(403).send('Solo los clientes pueden ver sus mascotas');
    }
    
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', sql.Int, id)
            .query(`SELECT m.* FROM Mascotas m
                    JOIN Clientes c ON m.cliente_id = c.id
                    WHERE c.usuario_id = @userId`);
        
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener mascotas');
    }
};