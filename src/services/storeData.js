const { Storage } = require('@google-cloud/storage');
const uuid = require('uuid');

// Inisialisasi Google Cloud Storage
const storage = new Storage();
const bucketName = 'mlgc-bucket-1933'; // Ganti dengan nama bucket Anda

/**
 * Menyimpan data prediksi ke Google Cloud Storage
 */
const storeData = async (data) => {
    try {
        // Generate ID unik untuk file
        const fileId = uuid.v4();
        const fileName = `${fileId}.json`; // Nama file untuk hasil prediksi (format JSON)

        // Konversi data menjadi string JSON
        const dataBuffer = Buffer.from(JSON.stringify(data));

        // Tentukan bucket tempat data akan disimpan
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(fileName);

        // Upload data ke Cloud Storage
        await file.save(dataBuffer, {
            contentType: 'application/json',
            metadata: { contentDisposition: 'inline' },
        });

        console.log(`Data berhasil disimpan dengan ID ${fileId}`);

        // Kembalikan informasi file yang telah disimpan
        return {
            fileId,
            fileName,
            storageUrl: `gs://${bucketName}/${fileName}`, // URL untuk file yang telah disimpan
        };
    } catch (error) {
        console.error('Gagal menyimpan data:', error);
        throw new Error('Gagal menyimpan data prediksi');
    }
};

module.exports = { storeData };
