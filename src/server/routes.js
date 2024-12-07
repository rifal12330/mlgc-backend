const express = require('express');
const multer = require('multer');
const { handlePredict } = require('./handler');
const multerConfig = require('../services/multerConfig'); // Konfigurasi Multer

const router = express.Router();

// Definisikan rute API
router.post('/predict', multerConfig.single('image'), handlePredict);

module.exports = router;
