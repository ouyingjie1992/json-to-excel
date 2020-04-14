/**
 * 生成JSON文件
 * 用xmlKey文件解密
 */
const fs = require("fs");
const cheerio = require('cheerio');

const createJsonService = {
	async createFile(path) {
        // 获取秘钥json文件：比对xml中<TTGlyph=>第一个contour=>第一个pt的字形数值
        let keyData = fs.readFileSync('testData/xmlKey.json');
        keyData = JSON.parse(keyData);
        let key = {};
        for(let i=0; i<keyData.length; i++) {
            let item = keyData[i];
            let keyName = `${item.key.x}-${item.key.y}-${item.key.on}`;
            key[keyName] = item.label;
        }
        // 获取xml文件
        let data = fs.readFileSync(`${path}test.xml`);
        let resJson = [];
        const val = data.toString();
        let $ = cheerio.load(val, {
            ignoreWhitespace: true,
            xmlMode: true,
            decodeEntities: false
        });
        let $TTGlyph = $('TTGlyph');
        for (let i = 0; i < $TTGlyph.length; i++) {
            let $item = $TTGlyph.eq(i).children('contour').eq(0).children('pt').eq(0);
            let x = $item.attr('x');
            let y = $item.attr('y');
            let on = $item.attr('on');
            let keyName = `${x}-${y}-${on}`;
            let key1 = $TTGlyph.eq(i).attr('name').toLowerCase().replace('uni', '&#x') + ';';
            resJson.push(
                {
                    key1: key1,
                    key2: key[keyName]||'',
                }
            );
        }
        console.log('解密转化执行完毕');
        // 写入json文件
        let filePath = `${path}woff.json`;
        fs.writeFileSync(filePath, JSON.stringify(resJson, null, '\t'));

		return {
            code: 5000,
            data: `文件输出成功！${filePath}`
        };
	},
};

module.exports = createJsonService;
