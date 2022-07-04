const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const encryptor = require('simple-encryptor')(process.env.ENC_KEY);

var exportFuns = {};

exportFuns.getBcryptEncryption = (textStr) => {
    return bcrypt.hashSync(textStr, 10);
};

exportFuns.compareBcryptEncryption = (textStr, encryptText) => {
    return bcrypt.compareSync(textStr, encryptText);
};

exportFuns.getJwtEncryption = (dataObj = {}, expiresIn = process.env.JWT_EXPIRE_TIME) => {
    const generatedToken = jwt.sign(dataObj, process.env.JWT_SECRET_KEY, {
        expiresIn: expiresIn
    });
    return exportFuns.getEncryptedToken(generatedToken);
};

exportFuns.getEncryptedToken = (generatedToken) => {
    try {
        return encryptor.encrypt(generatedToken);
    } catch (err) {
        throw err.message;
    }
};

module.exports = exportFuns;