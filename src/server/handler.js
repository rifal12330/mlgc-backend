const { predict } = require('../services/inferenceService');
const { storeData } = require('../services/storeData');
const ClientError = require('../exceptions/clientError');
const InputError = require('../exceptions/inputError');
const uuid = require('uuid');

const handlePredict = async (req, res) => {
    try {
        const image = req.file;

        if (!image) {
            throw new InputError('File gambar tidak ditemukan');
        }

        const { result, suggestion } = await predict(image);

        // Simpan hasil prediksi ke Firestore
        const storedData = await storeData({
            id: uuid.v4(), // Generate ID unik untuk setiap prediksi
            result,
            suggestion,
            createdAt: new Date().toISOString(),
        });

        // Mengembalikan respons ke pengguna
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
        if (error instanceof InputError || error instanceof ClientError) {
            return res.status(error.statusCode).json({
                status: 'fail',
                message: error.message,
            });
        }

        return res.status(500).json({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi',
        });
    }
};

module.exports = { handlePredict };
