const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');
require('dotenv').config();  // Pastikan Anda memuat .env file

// Inisialisasi Google Cloud Storage
const storage = new Storage();

// Ambil bucket dan path file model dari environment variable MODEL_PATH
const modelPath = process.env.MODEL_PATH; // Format: gs://<bucket_name>/<model_path>
if (!modelPath) {
    throw new Error('MODEL_PATH environment variable is not set');
}

// Periksa apakah MODEL_PATH sesuai dengan format 'gs://<bucket_name>/<path>'
if (!modelPath.startsWith('gs://')) {
    throw new Error('MODEL_PATH harus dimulai dengan gs://');
}

const bucketName = modelPath.split('/')[2];
const modelPathInBucket = modelPath.replace(`gs://${bucketName}/`, '');
const localModelPath = path.join(__dirname, 'model.h5'); // Lokasi sementara di server lokal

const loadModel = async () => {
    try {
        console.log(`Downloading model from bucket: ${bucketName}, path: ${modelPathInBucket}`);

        // Periksa apakah file sudah ada di lokal
        if (fs.existsSync(localModelPath)) {
            console.log('Model already downloaded locally.');
            return localModelPath;
        }

        // Download model dari GCS ke sistem file lokal
        await storage
            .bucket(bucketName)
            .file(modelPathInBucket)
            .download({ destination: localModelPath });

        console.log('Model downloaded successfully.');
        return localModelPath; // Return path lokal untuk digunakan aplikasi
    } catch (error) {
        console.error('Failed to download model:', error);
        throw new Error('Unable to load model');
    }
};

module.exports = loadModel;
