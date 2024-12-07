const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs-node');

// Define the model and shard files' paths relative to the project
const modelFolderPath = path.join(__dirname, '../models'); // Folder containing model.json and shard files
const localModelPath = path.join(modelFolderPath, 'model.json'); // Path to the model.json file
const localShardFiles = [
    'group1-shard1of4.bin',
    'group1-shard2of4.bin',
    'group1-shard3of4.bin',
    'group1-shard4of4.bin'
]; // List of shard files

// Load model function
const loadModel = async () => {
    try {
        console.log(`Checking model and shard files in: ${modelFolderPath}`);

        // Check if the model.json file exists
        if (!fs.existsSync(localModelPath)) {
            throw new Error('Model file (model.json) does not exist in the expected path.');
        }

        // Check if all shard files exist
        for (const shardFile of localShardFiles) {
            const shardFilePath = path.join(modelFolderPath, shardFile);
            if (!fs.existsSync(shardFilePath)) {
                throw new Error(`Shard file ${shardFile} does not exist in the expected path.`);
            }
        }

        console.log('Model and shard files are ready.');

        // Load the model from the path using loadLayersModel
        const model = await tf.loadLayersModel(`file://${localModelPath}`);
        console.log('Model loaded successfully.');

        // Optionally, return the model for further use
        return model;

    } catch (error) {
        console.error('Failed to load model or shard files:', error);
        throw new Error('Unable to load model');
    }
};

module.exports = loadModel;
