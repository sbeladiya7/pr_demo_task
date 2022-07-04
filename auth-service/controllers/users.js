const users = require('../services/users');
const encryption = require('../helpers/encryption');

var exportFuns = {};

exportFuns.register = async (req, res) => {
    try {
        const { username, fullname, email, password } = req.body;
        if (!username || !fullname || !email || !password) {
            res.status(400).json({
                message: 'please enter all required fields!'
            });
        }

        const usernameData = await users.findOne({ username: username });
        if (usernameData) {
            return res.status(400).json({
                message: 'this username already exist, try another one!'
            });
        }
        const emailData = await users.findOne({ email: email });
        if (emailData) {
            return res.status(400).json({
                message: 'user with this email already exist!'
            });
        }
        const encPassword = encryption.getBcryptEncryption(password)
        const createPattern = {
            username,
            fullname,
            email,
            password: encPassword
        }
        users.create(createPattern).then(() => {
            res.status(201).json({
                message: 'user is registerd!'
            });
        }).catch((e) => {
            console.log(e.message);
            res.status(400).json({
                message: 'something went wrong!'
            });
        });

    } catch (e) {
        console.log(e.message);
        res.status(400).json({
            message: 'something went wrong!'
        });
    }
};

exportFuns.login = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({
                message: 'please enter valid credentials!'
            });
        }

        const userData = await users.findOne({ $or: [{ email: email }, { username: email }] });
        if (!userData) {
            return res.status(404).json({
                message: 'user with this email not exist!'
            });
        }
        const isPasswordCorrect = encryption.compareBcryptEncryption(password, userData.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "password is mismatched!"
            });
        }
        const tokenObj = {
            id: userData._id,
            username: userData.username,
            email: userData.email,
        }
        const token = encryption.getJwtEncryption(tokenObj, '30d');
        const resObj = { ...tokenObj, token }
        res.status(200).json({
            data: resObj
        });
    } catch (e) {
        console.log(e.message);
        res.status(400).json({
            message: 'something went wrong!'
        });
    }
};

exportFuns.profile = (req, res) => {
    const { id } = req.headers;
    try {
        const findPattern = { _id: id };
        const selectPattern = "username fullname email"
        users.findOne(findPattern, selectPattern).then((userData) => {
            if (userData) {
                res.status(200).json({
                    data:userData,
                });
            } else {
                res.status(404).json({
                    message: 'user not found!'
                });
            }
        }).catch((e) => {
            console.log(e.message);
            res.status(400).json({
                message: 'something went wrong!'
            });
        });
    } catch (e) {
        console.log(e.message);
        res.status(400).json({
            message: 'something went wrong!'
        });
    }
};

module.exports = exportFuns;