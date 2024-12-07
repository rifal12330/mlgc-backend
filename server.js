const express = require('express');
const loadModel = require('./src/services/loadModel');
const predictRoutes = require('./src/server/routes'); // 

const app = express();
const port = 8080;

// Middleware untuk parsing JSON
app.use(express.json());


app.use(predictRoutes);

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
