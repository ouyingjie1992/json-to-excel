/**
 * woff文件解析xml文件
 */
const fs = require("fs");
const path = require("path");
const mimeType = require('mime-types');
// const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

/**
 * 读取路径信息
 * @param {string} path 路径
 */
const getStat = (path) => {
	return new Promise((resolve, reject) => {
		fs.stat(path, (err, stats) => {
			if (err) {
				resolve(false);
			} else {
				resolve(stats);
			}
		});
	});
};

// 读取目录下的woff文件
const dirEach = async (dir) => {
    let isExists = await getStat(dir);
	//如果该路径不存在或不是目录，返回false
	if (!isExists || !isExists.isDirectory()) {
		return false;
	}
    let pa = fs.readdirSync(dir);
    let resultData = '';
    for(let i=0; i<pa.length; i++) {
        let item = pa[i];
        let itemPath = path.join(dir, item)
        itemPath = path.resolve(itemPath);
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
    if(resultData === '') {
		return false;
    }
    return resultData;
};

const createXmlService = {
    async output(filePath) {
        let res = {};
        
        // 获取woff文件名（多个取第一个）
        let woffName = await dirEach(filePath);
        if(!woffName) {
            // 获取woff文件失败
            res = {
                code: 7000,
                data: 'woff文件获取失败，请检查目标路径是否正确'
            };
        } else {
            // 异步执行
            // exec('python testData/woffToXml.py',function(error,stdout,stderr){
            //     if(error) {
            //         console.info('stderr : '+stderr);
            //     }
            //     console.log('exec: ' + stdout);
            // })
            // woff解析xml  同步执行
            let sourcePath = path.join(filePath, woffName);
            let outPath = path.join(filePath, 'test.xml');
            const resXml = execSync(`python lib/python/woffToXml.py ${sourcePath} ${outPath}`)
            // console.log(createXml.toString())

            res = {
                code: 5000,
                data: 'woff文件解析成功'
            };
        }
        return res;
    }
}

module.exports = createXmlService;