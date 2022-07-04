const jwt = require('jsonwebtoken');
const encryptor = require('simple-encryptor')(process.env.ENC_KEY);

var exportFuns = {};

exportFuns.getJwtDecryption = (token) => {
    try {
        const authToken = exportFuns.getDecryptedToken(token);
        return jwt.verify(authToken, process.env.JWT_SECRET_KEY)
    } catch (err) {
        throw err.message;
    }
};

exportFuns.getDecryptedToken = (token) => {
    try {
        return encryptor.decrypt(token);
    } catch (err) {
        throw err.message;
    }
};

module.exports = exportFuns;