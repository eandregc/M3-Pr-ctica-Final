const { poolPromise, sql } = require('../config/db');

exports.getCitas = async (req, res) => {
    const { id, rol } = req.user;
    try {
        const pool = await poolPromise;
        let query;
        if (rol === 'veterinario' || rol === 'admin') {
            query = `SELECT c.*, 
                     m.nombre as mascota_nombre, 
                     u.nombre as cliente_nombre
                     FROM Citas c 
                     LEFT JOIN Mascotas m ON c.mascota_id = m.id 
                     LEFT JOIN Clientes cl ON m.cliente_id = cl.id 
                     LEFT JOIN Usuarios u ON cl.usuario_id = u.id 
                     WHERE c.estado = 'programada'
                     ORDER BY c.fecha ASC`;
        } else if (rol === 'cliente') {
            query = `SELECT c.*, 
                     m.nombre as mascota_nombre
                     FROM Citas c 
                     LEFT JOIN Mascotas m ON c.mascota_id = m.id 
                     LEFT JOIN Clientes cl ON m.cliente_id = cl.id 
                     WHERE cl.usuario_id = ${id} AND c.estado = 'programada'
                     ORDER BY c.fecha ASC`;
        } else {
            return res.status(403).send('Rol no permitido');
        }
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener citas');
    }
};

exports.crearCita = async (req, res) => {
    const { mascota_id, fecha, motivo } = req.body;
    const { id, rol } = req.user;

    if (rol !== 'cliente' && rol !== 'admin') {
        return res.status(403).send('No autorizado para crear citas');
    }

    try {
        const pool = await poolPromise;
        
        // Comprobar que la fecha no esté ya ocupada
        const fechaDate = new Date(fecha);
        const fechaCheck = await pool.request()
            .input('fecha', sql.DateTime, fechaDate)
            .query(`SELECT * FROM Citas 
                    WHERE fecha = @fecha AND estado = 'programada'`);
                    
        if (fechaCheck.recordset.length > 0) {
            return res.status(400).send('Esta hora ya está reservada');
        }
        
        // Insertar la cita - permitiendo mascota_id null
        await pool.request()
            .input('mascota_id', mascota_id ? sql.Int : sql.Int, mascota_id || null)
            .input('fecha', sql.DateTime, fechaDate)
            .input('motivo', sql.NVarChar, motivo)
            .query(`INSERT INTO Citas (mascota_id, fecha, motivo, estado)
                    VALUES (@mascota_id, @fecha, @motivo, 'programada')`);
                    
        res.status(201).send('Cita creada con éxito');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al crear la cita');
    }
};

exports.eliminarCita = async (req, res) => {
    const { id: citaId } = req.params;
    const { id: userId, rol } = req.user;
    
    try {
        const pool = await poolPromise;
        
        // Verificar si el usuario tiene permiso para eliminar esta cita
        let permissionCheck;
        if (rol === 'veterinario' || rol === 'admin') {
            permissionCheck = await pool.request()
                .input('citaId', sql.Int, citaId)
                .query(`SELECT * FROM Citas WHERE id = @citaId`);
        } else if (rol === 'cliente') {
            permissionCheck = await pool.request()
                .input('citaId', sql.Int, citaId)
                .input('userId', sql.Int, userId)
                .query(`SELECT c.* FROM Citas c 
                        LEFT JOIN Mascotas m ON c.mascota_id = m.id 
                        LEFT JOIN Clientes cl ON m.cliente_id = cl.id 
                        WHERE c.id = @citaId AND cl.usuario_id = @userId`);
        }
        
        if (permissionCheck.recordset.length === 0) {
            return res.status(403).send('No autorizado para eliminar esta cita');
        }
        
        // Eliminar la cita
        await pool.request()
            .input('citaId', sql.Int, citaId)
            .query(`DELETE FROM Citas WHERE id = @citaId`);
            
        res.status(200).send('Cita eliminada con éxito');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar la cita');
    }
};

exports.editarCita = async (req, res) => {
    const { id: citaId } = req.params;
    const { fecha, motivo } = req.body;
    const { id: userId, rol } = req.user;
    
    try {
        const pool = await poolPromise;
        
        // Verificar si el usuario tiene permiso para editar esta cita
        let permissionCheck;
        if (rol === 'veterinario' || rol === 'admin') {
            permissionCheck = await pool.request()
                .input('citaId', sql.Int, citaId)
                .query(`SELECT * FROM Citas WHERE id = @citaId`);
        } else if (rol === 'cliente') {
            // Para clientes con mascotas registradas
            const registeredPetCheck = await pool.request()
                .input('citaId', sql.Int, citaId)
                .input('userId', sql.Int, userId)
                .query(`SELECT c.* FROM Citas c 
                        LEFT JOIN Mascotas m ON c.mascota_id = m.id 
                        LEFT JOIN Clientes cl ON m.cliente_id = cl.id 
                        WHERE c.id = @citaId AND cl.usuario_id = @userId`);
                        
            permissionCheck = registeredPetCheck;
        }
        
        if (permissionCheck.recordset.length === 0) {
            return res.status(403).send('No autorizado para editar esta cita');
        }
        
        // Comprobar que la nueva fecha no esté ya ocupada (si se está cambiando la fecha)
        if (fecha) {
            const fechaDate = new Date(fecha);
            const fechaCheck = await pool.request()
                .input('fecha', sql.DateTime, fechaDate)
                .input('citaId', sql.Int, citaId)
                .query(`SELECT * FROM Citas 
                        WHERE fecha = @fecha AND estado = 'programada' AND id != @citaId`);
                        
            if (fechaCheck.recordset.length > 0) {
                return res.status(400).send('Esta hora ya está reservada');
            }
        }
        
        // Construir la consulta de actualización dinámicamente
        let updateFields = [];
        let queryParams = {};
        
        if (fecha) {
            updateFields.push('fecha = @fecha');
            queryParams.fecha = { type: sql.DateTime, value: new Date(fecha) };
        }
        
        if (motivo) {
            updateFields.push('motivo = @motivo');
            queryParams.motivo = { type: sql.NVarChar, value: motivo };
        }
        
        if (updateFields.length === 0) {
            return res.status(400).send('No se proporcionaron campos para actualizar');
        }
        
        // Crear la consulta SQL
        const updateQuery = `UPDATE Citas SET ${updateFields.join(', ')} WHERE id = @citaId`;
        
        // Ejecutar la actualización
        const request = pool.request();
        request.input('citaId', sql.Int, citaId);
        
        // Añadir los parámetros dinámicamente
        Object.keys(queryParams).forEach(key => {
            request.input(key, queryParams[key].type, queryParams[key].value);
        });
        
        await request.query(updateQuery);
        
        res.status(200).send('Cita actualizada con éxito');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar la cita');
    }
};