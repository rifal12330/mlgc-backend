const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');

// Inisialisasi Google Cloud Storage
const storage = new Storage();
const bucketName = process.env.MODEL_PATH.split('/')[2];
const modelPathInBucket = process.env.MODEL_PATH.replace(`gs://${bucketName}/`, '');
const localModelPath = path.join(__dirname, 'model.h5'); // Lokasi sementara di server lokal

const loadModel = async () => {
    try {
        console.log(`Downloading model from bucket: ${bucketName}`);
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
