const { predict } = require('../services/inferenceService');
const { storeData } = require('../services/storeData');
const ClientError = require('../exceptions/ClientError');
const InputError = require('../exceptions/InputError');
const uuid = require('uuid');

// Handle image upload and prediction
const handlePredict = async (req, res) => {
    try {
        // Get the uploaded image from the request
        const image = req.file;

        // Check if the file is uploaded
        if (!image) {
            throw new InputError('File gambar tidak ditemukan');
        }

        // Make a prediction using the uploaded image
        const { result, suggestion } = await predict(image);

        // Save the prediction results to Firestore
        const storedData = await storeData({
            id: uuid.v4(), // Generate unique ID for each prediction
            result,
            suggestion,
            createdAt: new Date().toISOString(),
        });

        // Return the response to the user with prediction details
        return res.status(200).json({
            status: 'success',
            message: 'Model berhasil melakukan prediksi',
            data: {
                id: storedData.docId,
                result,
                suggestion,
                createdAt: new Date().toISOString(),
            },
        });
    } catch (error) {
        // Handle errors related to missing file or invalid file input
        if (error instanceof InputError || error instanceof ClientError) {
            return res.status(error.statusCode).json({
                status: 'fail',
                message: error.message,
            });
        }

        // Handle other unexpected errors
        return res.status(500).json({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi',
        });
    }
};

module.exports = { handlePredict };
