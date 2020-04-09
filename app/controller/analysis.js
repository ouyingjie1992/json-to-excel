
const jsonToExcelCtrl = require('./jsonToExcel');


async function jsonToExcel(fileName) {
    let res = await jsonToExcelCtrl.init(fileName);
    return res;
};

module.exports = {
    jsonToExcel
};