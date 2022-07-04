const users = require("../models/users");

var exportFuns = {};

exportFuns.create = async (createPattern) => {
    return users.create(createPattern).then((createRes) => {
        return createRes;
    }).catch((err) => {
        throw err;
    });
};

exportFuns.findOne = async (findPattern, selectPattern = "") => {
    return users.findOne(findPattern, selectPattern).then((resultData) => {
        return resultData;
    }).catch((err) => {
        throw err;
    });
};

module.exports = exportFuns;
