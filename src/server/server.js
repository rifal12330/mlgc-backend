const express = require('express');
const loadModel = require('./services/loadModel');

const app = express();
const port = process.env.PORT || 8080;

(async () => {
    try {
        // Load model sebelum server dimulai
        const modelPath = await loadModel();
        console.log(`Model loaded from: ${modelPath}`);

        // Jalankan server
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error loading model:', error);
        process.exit(1); // Keluar jika gagal memuat model
    }
})();
