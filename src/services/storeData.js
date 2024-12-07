const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore(); // Inisialisasi Firestore

/**
 * Menyimpan data prediksi ke Firestore
 */
const storeData = async (data) => {
    try {
        // Generate ID untuk dokumen Firestore (menggunakan UUID)
        const docId = data.id;

        // Referensi ke koleksi "predictions" dan dokumen dengan ID yang dihasilkan
        const docRef = firestore.collection('predictions').doc(docId);

        // Simpan data prediksi ke Firestore
        await docRef.set({
            id: data.id,
            result: data.result,
            suggestion: data.suggestion,
            createdAt: data.createdAt,
        });

        console.log(`Data berhasil disimpan dengan ID ${docId}`);

        // Kembalikan informasi data yang telah disimpan
        return {
            docId,
            storageUrl: `https://firestore.googleapis.com/v1/projects/${process.env.GCLOUD_PROJECT}/databases/(default)/documents/predictions/${docId}`,
        };
    } catch (error) {
        console.error('Gagal menyimpan data ke Firestore:', error);
        throw new Error('Gagal menyimpan data prediksi');
    }
};

module.exports = { storeData };
