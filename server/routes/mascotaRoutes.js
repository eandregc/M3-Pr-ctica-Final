const express = require('express');
const router = express.Router();
const { createMascota, getMascotasByUser } = require('../controllers/mascotaController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, createMascota);
router.get('/user', verifyToken, getMascotasByUser);

module.exports = router;