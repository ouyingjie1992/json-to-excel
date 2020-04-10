const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const createJson = require('../service/createJson');


const woffToJsonController = {
    async init(fileName) {
        let res = {
            code: '',
            data: ''
        };
        let path = `testData/source/${fileName}/`;
        // 异步执行
        // exec('python testData/woffToXml.py',function(error,stdout,stderr){
        //     if(error) {
        //         console.info('stderr : '+stderr);
        //     }
        //     console.log('exec: ' + stdout);
        // })
        // 同步执行
        const output = execSync('python testData/woffToXml.py ' + path)
        // console.log(output.toString())
        let resData = await createJson.createFile(path);

        res = {
            code: 5000,
            data: '完成woff转化json'
        }
        return res;
    }
}

module.exports = woffToJsonController;