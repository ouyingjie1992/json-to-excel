
const woffToJsonCtrl = require('./woffToJson');
const jsonToExcelCtrl = require('./jsonToExcel');


async function woffToJson(fileName) {
    let res = await woffToJsonCtrl.init(fileName);
    return res;
};

async function jsonToExcel(fileName) {
    let res = await jsonToExcelCtrl.init(fileName);
    return res;
};

module.exports = {
    jsonToExcel,
    woffToJson
};