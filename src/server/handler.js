const { predict } = require('../services/inferenceService');
const InputError = require('../exceptions/InputError');
const ClientError = require('../exceptions/ClientError');

const handlePredict = async (req, res) => {
    try {
        const image = req.file;

        if (!image) {
            throw new InputError('File gambar tidak ditemukan');
        }

        const { result, suggestion } = await predict(image);

        return res.status(200).json({
            status: 'success',
            message: 'Model is predicted successfully',
            data: {
                id: uuidv4(),
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
