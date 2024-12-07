const express = require('express');
const multerConfig = require('../services/multerconfig');  // Correct path to multerConfig
const { handlePredict } = require('./handler'); // Correct path to handler

const router = express.Router();

// Use multerConfig to handle file upload for the '/predict' endpoint
router.post('/', multerConfig.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Handle prediction logic (e.g., call model to make predictions)
        await handlePredict(req, res);

    } catch (error) {
        console.error('Error during prediction:', error);
        return res.status(500).json({ error: 'Error during prediction' });
    }
});

module.exports = router;
