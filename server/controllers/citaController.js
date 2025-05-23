const { poolPromise, sql } = require('../config/db');

exports.getCitas = async (req, res) => {
    const { id, rol } = req.user;
    try {
        const pool = await poolPromise;
        let query;
        if (rol === 'veterinario' || rol === 'admin') {
            query = "SELECT * FROM Citas WHERE estado = 'programada'";
        } else if (rol === 'cliente') {
            query = `SELECT c.* FROM Citas c 
                     JOIN Mascotas m ON c.mascota_id = m.id 
                     JOIN Clientes cl ON m.cliente_id = cl.id 
                     WHERE cl.usuario_id = ${id} AND c.estado = 'programada'`;
        } else {
            return res.status(403).send('Rol no permitido');
        }
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error al obtener citas');
    }
};