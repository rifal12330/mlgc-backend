const Jimp = require('jimp');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

// Fungsi untuk memproses gambar menjadi tensor
const processImage = async (imagePath) => {
    try {
        // Pastikan imagePath adalah path file yang valid
        if (!fs.existsSync(imagePath)) {
            throw new Error(`Gambar tidak ditemukan di path: ${imagePath}`);
        }

        // Membaca gambar menggunakan Jimp
        const image = await Jimp.read(imagePath);
        image.resize(224, 224); // Ubah ukuran gambar sesuai model (224x224 umumnya untuk model ImageNet)

        // Mengonversi gambar yang sudah di-resize menjadi buffer
        const buffer = await image.getBufferAsync(Jimp.MIME_JPEG); // Dapatkan buffer gambar dengan format JPEG
        const imageTensor = tf.node.decodeImage(buffer); // Decode buffer menjadi tensor

        // Mengembalikan tensor dengan dimensi batch (untuk prediksi di TensorFlow)
        return imageTensor.expandDims(0); // Menambahkan dimensi batch (1, 224, 224, 3) untuk prediksi
    } catch (error) {
        // Menangani kesalahan dengan logging yang jelas
        console.error('Error processing image:', error.message);
        throw new Error('Gagal memproses gambar. Pastikan file gambar valid dan dapat diakses.');
    }
};

module.exports = { processImage };
