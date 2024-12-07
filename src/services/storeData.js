const admin = require('firebase-admin');
admin.initializeApp();

const storeData = async (predictionData) => {
    try {
        const firestore = admin.firestore();
        const docRef = await firestore.collection('predictions').add(predictionData);
        return { docId: docRef.id }; // Mengembalikan ID dokumen yang disimpan
    } catch (error) {
        console.error('Gagal menyimpan data:', error);
        throw new Error('Failed to store data');
    }
};

module.exports = { storeData };
