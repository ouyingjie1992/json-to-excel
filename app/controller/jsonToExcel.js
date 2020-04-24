const GetJson = require('../service/getJson');
const CreateExcel = require('../service/createExcel');

Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, // 小时
        "H+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds()
        // 毫秒
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt
            .replace(
                RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};


const jsonToExcelController = {
    async init(filePath) {
        let res = {
            code: '',
            data: ''
        };
        const date = (new Date()).format('yyyyMMdd-HHmmss');
        let status = '';
        let status2 = '';
        let status3 = '';
        let resData = await GetJson.getData(filePath, 'shopList');
        if(resData.code === 5000) {
            status = await CreateExcel.createFile(date, resData.data, 'shopList', filePath);
        } else {
            status = resData.data;
        }
        let resData2 = await GetJson.getData(filePath, 'foodList');
        if(resData2.code === 5000) {
            status2 = await CreateExcel.createFile(date, resData2.data, 'foodList', filePath);
        } else {
            status2 = resData2.data;
        }
        let resData3 = await GetJson.getData(filePath, 'searchList');
        if(resData3.code === 5000) {
            status3 = await CreateExcel.createFile(date, resData3.data, 'searchList', filePath);
        } else {
            status3 = resData3.data;
        }
        res = {
            code: 5000,
            data: `${status}>>>>>>>>${status2}>>>>>>>>${status3}`
        }
        return res;
    }
}

module.exports = jsonToExcelController;