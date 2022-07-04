const encryption = require('../helpers/encryption');

var exportFuns = {};

const unAuthAccessibleApis = [
    '',
    '/user',
    '/user/register',
    '/user/login',
];

exportFuns.checkJWTAuthentication = async (req, res, next) => {
    try {

        const authHeader = req.headers["authorization"] || "";
        const authToken = authHeader ? authHeader.split(' ')[1] : "";

        const reqPath = req.path.split("/");
        let checkRoutePath = "";
        checkRoutePath += reqPath[1] ? "/" + reqPath[1] : "";   // Route User Type
        checkRoutePath += reqPath[2] ? "/" + reqPath[2] : "";   // Route Module Type
        if (authToken) {
            try {
                const decodedToken = encryption.getJwtDecryption(authToken);
                const id = decodedToken.id || '';
                const username = decodedToken.username || '';
                const email = decodedToken.email || '';
                const expiresTime = parseInt(decodedToken.exp);
                const currentTimestamp = Math.floor((Date.now() / 1000) / 60);   // In minutes

                req.headers["id"] = id;
                req.headers["username"] = username;
                req.headers["email"] = email;

                if (unAuthAccessibleApis.includes(checkRoutePath)) {
                    next();
                } else {
                    if (!expiresTime || expiresTime < currentTimestamp) {
                        return res.status(408).json({
                            message: 'login session expired!'
                        });
                    } else if (!id || !email || !username) {
                        return res.status(401).json({
                            message: 'unauthorized!'
                        });
                    } else {
                        next();
                    }
                }
            } catch (e) {
                console.log(e.message);
                return res.status(401).json({
                    message: 'unauthorized!'
                });
            }
        } else {
            if (unAuthAccessibleApis.includes(checkRoutePath)) {
                next();
            } else {
                return res.status(401).json({
                    message: 'unauthorized!'
                });
            }
        }
    } catch (e) {
        console.log(e.message);
        return res.status(400).json({
            message: 'something went wrong!'
        });
    }
};

module.exports = exportFuns;