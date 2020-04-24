
const woffToJsonCtrl = require('./woffToJson');
const jsonToExcelCtrl = require('./jsonToExcel');


async function woffToJson(filePath) {
    let res = await woffToJsonCtrl.init(filePath);
    return res;
};

async function jsonToExcel(filePath) {
    let res = await jsonToExcelCtrl.init(filePath);
    return res;
};

module.exports = {
    jsonToExcel,
    woffToJson
};