const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const multerStorageCloudStorage = require('multer-storage-cloud-storage');
const path = require('path');
require('dotenv').config();

// Inisialisasi Google Cloud Storage
const storage = new Storage();

// Ambil bucket dari environment variable
const bucketName = process.env.GCS_BUCKET_NAME; // Pastikan Anda menyetelnya dalam .env

// Membuat konfigurasi multer dengan GCS
const multerConfig = multer({
    storage: multerStorageCloudStorage({
        bucket: bucketName,
        // Tentukan folder di dalam bucket tempat file disimpan
        destination: (req, file, cb) => {
            // Menyimpan file di folder 'images'
            cb(null, 'images/');
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname); // Menambahkan ekstensi file asli
            cb(null, fileName); // Menggunakan nama file unik
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal ukuran file 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
        }
    }
});

module.exports = multerConfig;
