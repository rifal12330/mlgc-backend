class InputError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InputError';
        this.statusCode = 422; // Unprocessable Entity
    }
}

module.exports = InputError;
