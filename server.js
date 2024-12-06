const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Inisialisasi Express
const app = express();
const port = 8080;

// Konfigurasi Multer untuk menerima file
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1000000 }, // Batas ukuran file 1MB
    fileFilter: (req, file, cb) => {
        // Validasi tipe file (hanya gambar)
        const fileTypes = /jpeg|jpg|png/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extName && mimeType) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    },
});

// Endpoint Prediksi
app.post('/predict', upload.single('image'), (req, res) => {
    try {
        // Validasi ukuran file (handled by multer)
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                status: 'fail',
                message: 'File tidak ditemukan atau format tidak valid',
            });
        }

        // Simulasi hasil prediksi dari model ML
        const isCancer = Math.random() < 0.5; // Ubah dengan prediksi model ML

        const response = {
            status: 'success',
            message: 'Model is predicted successfully',
            data: {
                id: uuidv4(),
                result: isCancer ? 'Cancer' : 'Non-cancer',
                suggestion: isCancer
                    ? 'Segera periksa ke dokter!'
                    : 'Penyakit kanker tidak terdeteksi.',
                createdAt: new Date().toISOString(),
            },
        };

        return res.status(200).json(response);
    } catch (error) {
        // Tangani error dari prediksi atau validasi lainnya
        if (error.message === 'File too large') {
            return res.status(413).json({
                status: 'fail',
                message: 'Payload content length greater than maximum allowed: 1000000',
            });
        }

        return res.status(400).json({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi',
        });
    }
});


// Error Handling Middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            status: 'fail',
            message: 'Payload content length greater than maximum allowed: 1000000',
        });
    }

    return res.status(400).json({
        status: 'fail',
        message: 'Terjadi kesalahan dalam melakukan prediksi',
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});