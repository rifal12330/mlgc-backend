const { loadModel } = require('./loadModel');
const { storeData } = require('./storeData');
const ClientError = require('../exceptions/ClientError');

const predict = async (image) => {
    try {
        // Load model
        const model = await loadModel();

        // Lakukan prediksi
        const prediction = model.predict(image);
        const result = prediction > 0.5 ? 'Cancer' : 'Non-cancer';
        const suggestion = result === 'Cancer' ? 'Segera periksa ke dokter!' : 'Penyakit kanker tidak terdeteksi.';

        // Simpan hasil prediksi (opsional)
        await storeData({ result, suggestion });

        return { result, suggestion };
    } catch (error) {
        throw new ClientError('Error saat melakukan prediksi');
    }
};

module.exports = { predict };
