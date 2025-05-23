const express = require('express');
const router = express.Router();
const { getCitas, crearCita, editarCita, eliminarCita } = require('../controllers/citaController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, getCitas);
router.post('/', verifyToken, crearCita);
router.put('/:id', verifyToken, editarCita);
router.delete('/:id', verifyToken, eliminarCita);

module.exports = router;