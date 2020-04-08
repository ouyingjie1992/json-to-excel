
const jsonToExcelCtrl = require('./jsonToExcel');


async function jsonToExcel() {
    const res = await jsonToExcelCtrl.init();
    console.log(res)
};

module.exports = {
    jsonToExcel
};