const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load environment variables

// Initialize Google Cloud Storage
const storage = new Storage();

// Get bucket and model file path from environment variable
const modelPath = process.env.MODEL_PATH;  // Path to model.json in GCS
const bucketName = process.env.GCS_BUCKET_NAME; // GCS bucket name
const modelPathInBucket = modelPath.replace(`gs://${bucketName}/`, ''); // Removing the gs://<bucket> part from the model path
const localModelPath = path.join(__dirname, 'model.json'); // Temporary local path for model.json

// Load model function
const loadModel = async () => {
    try {
        console.log(`Downloading model from bucket: ${bucketName}, path: ${modelPathInBucket}`);

        // Check if model is already downloaded locally
        if (fs.existsSync(localModelPath)) {
            console.log('Model already downloaded locally.');
            return localModelPath;
        }

        // Download model.json file from GCS to local file system
        await storage
            .bucket(bucketName)
            .file(modelPathInBucket)
            .download({ destination: localModelPath });

        console.log('Model downloaded successfully.');

        // Download shard files (group1-shard1of4.bin, group1-shard2of4.bin, etc.)
        const shardFiles = [
            'group1-shard1of4.bin',
            'group1-shard2of4.bin',
            'group1-shard3of4.bin',
            'group1-shard4of4.bin'
        ];

        // Download each shard file
        for (const shard of shardFiles) {
            const localShardPath = path.join(__dirname, shard); // Path to store shard file locally
            const shardPathInBucket = `submissions-model/${shard}`; // Path to shard file in GCS
            await storage.bucket(bucketName).file(shardPathInBucket).download({ destination: localShardPath });
            console.log(`${shard} downloaded successfully.`);
        }

        return localModelPath; // Return local path for use in application
    } catch (error) {
        console.error('Failed to download model or shard files:', error);
        throw new Error('Unable to load model');
    }
};

module.exports = loadModel;
