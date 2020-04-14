/**
 * woff文件解析xml文件
 */
const fs = require("fs");
const path = require("path");
const mimeType = require('mime-types');
// const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

// 读取目录下的woff文件
const dirEach = (dir) => {
    let pa = fs.readdirSync(dir);
    let resultData = '';
    for(let i=0; i<pa.length; i++) {
        let item = pa[i];
        let itemPath = path.resolve(dir + '/' + item);
        let stat = fs.statSync(itemPath);
        if (stat.isDirectory()) {
            continue;
        }
            
        let filePath = path.resolve(itemPath); // 原始文件地址
        let fileMimeType = mimeType.lookup(filePath); // 获取文件的 memeType
        let fileName = filePath.split('\\').slice(-1)[0].split('/').slice(-1)[0].split('.')[0]; // 提取文件名
        // 如果不是woff文件，则跳过
        if (!fileMimeType.toString().includes("woff")) {
            continue;
        } else {
            // 返回woff文件名
            resultData = `${fileName}.woff`;
            break;
        }
    }
    return resultData;
};

const createXmlService = {
    async output(path) {
        let res = {};
        
        // 获取woff文件名（多个取第一个）
        let woffName = dirEach(path);
        // 异步执行
        // exec('python testData/woffToXml.py',function(error,stdout,stderr){
        //     if(error) {
        //         console.info('stderr : '+stderr);
        //     }
        //     console.log('exec: ' + stdout);
        // })
        // woff解析xml  同步执行
        const resXml = execSync(`python lib/python/woffToXml.py ${path} ${woffName}`)
        // console.log(createXml.toString())

        res = {
            code: 5000,
            data: 'woff文件解析成功'
        };
        return res;
    }
}

module.exports = createXmlService;