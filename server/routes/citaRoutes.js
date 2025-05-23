const express = require('express');
const router = express.Router();
const { getCitas } = require('../controllers/citaController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, getCitas);

module.exports = router;