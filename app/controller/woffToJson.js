const createJson = require('../service/createJson');
const createXml = require('../service/createXml');


const woffToJsonController = {
    async init(filePath) {
        let res = {
            code: '',
            data: ''
        };
        let path = filePath;

        // woff解析xml  同步执行
        let resXml = await createXml.output(path);
        if(resXml.code === 5000) {
            // xml生成秘钥json文件
            res = await createJson.createFile(path);
        } else {
            res = resXml;
            console.log('xml生成秘钥json文件失败');
        }

        return res;
    }
}

module.exports = woffToJsonController;