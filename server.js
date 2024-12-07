const express = require('express');
const multer = require('multer');
const path = require('path');
const { predict } = require('./src/services/inferenceService');
const { storeData } = require('./src/services/storeData');
const ClientError = require('./src/exceptions/ClientError');
const InputError = require('./src/exceptions/InputError');
const uuid = require('uuid');

// Create an Express app
const app = express();

// Define storage for multer (temporarily save the uploaded image)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Max file size: 1MB
}).single('image'); // Expect a single file upload with the field name 'image'

// POST endpoint for image prediction
app.post('/predict', upload, async (req, res) => {
  try {
    // Handle the case where no file is uploaded
    if (!req.file) {
      return res.status(400).json({
        status: 'fail',
        message: 'No image file provided',
      });
    }

    // Handle the case where the file size exceeds the limit (Multer's error)
    if (req.file.size > 1000000) {
      return res.status(413).json({
        status: 'fail',
        message: 'Payload content length greater than maximum allowed: 1000000',
      });
    }

    // Process the image with the model prediction
    const { result, suggestion } = await predict(req.file.buffer); // Use buffer for in-memory image

    // Save prediction results to Firestore (or any database you are using)
    const storedData = await storeData({
      id: uuid.v4(),
      result,
      suggestion,
      createdAt: new Date().toISOString(),
    });

    // Return the result to the user
    return res.status(200).json({
      status: 'success',
      message: 'Model is predicted successfully',
      data: {
        id: storedData.docId,
        result,
        suggestion,
        createdAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    // Handle any errors that occur during the prediction process
    if (error instanceof InputError || error instanceof ClientError) {
      return res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    }

    // General error handling for unexpected errors
    return res.status(400).json({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi',
    });
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
