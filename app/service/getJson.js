/**
 * 批量读取json文件
 */
const fs = require("fs");
const mimeType = require('mime-types');
const path = require("path");

// 处理数字
let realNumberArr = [
    {
        key1: '&#xe30d;',
        key2: '0'
    },
    {
        key1: '&#xe1ee;',
        key2: '1'
    },
    {
        key1: '&#xe30f;',
        key2: '2'
    },
    {
        key1: '&#xf875;',
        key2: '3'
    },
    {
        key1: '&#xe7a7;',
        key2: '4'
    },
    {
        key1: '&#xed6b;',
        key2: '5'
    },
    {
        key1: '&#xf882;',
        key2: '6'
    },
    {
        key1: '&#xe2dd;',
        key2: '7'
    },
    {
        key1: '&#xe48d;',
        key2: '8'
    },
    {
        key1: '&#xe181;',
        key2: '9'
    }
];

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
// 格式化数据-shopList
// https://i.waimai.meituan.com/openh5/channel/kingkongshoplist
const deDuplication1 = (data) => {
    if(!data) {
        return [];
    }
    let shopNameArr = [];
    let resultArr = [];
    for (let i = 0; i < data.length; i++) {
        let item = data[i];
        let parentFileName = item.parentFileName;
        item.data = item.data || {};
        let shopList = item.data.shopList || [];
        for (let j = 0; j < shopList.length; j++) {
            let item2 = shopList[j];
            item2.parentFileName = parentFileName;
            // 处理优惠活动信息
            let discounts2 = '';
            if(item2.discounts2 != null) {
                for (let k = 0; k < item2.discounts2.length; k++) {
                    discounts2 += item2.discounts2[k].info + ';';
                }
            }
            item2.discounts2 = discounts2;
            // 处理月销量信息
            let monthSalesTip = '';
            monthSalesTip = item2.monthSalesTip.replace('月售', '');
            item2.monthSalesTip = monthSalesTip;
            for (let val in item2) {
                for (let k = 0; k < realNumberArr.length; k++) {
                    item2[val] = item2[val].toString();
                    item2[val] = item2[val].replace(new RegExp(realNumberArr[k].key1,'g'), realNumberArr[k].key2);
                }
            }
            // 用店名去重 shopName
            let index = shopNameArr.indexOf(item2.shopName);
            if (index === -1) {
                shopNameArr.push(item2.shopName);
                resultArr.push(item2);
            } else {
                // if (!isNaN(item2.parentFileName) && !isNaN(resultArr[index].parentFileName) && item2.parentFileName > resultArr[index].parentFileName) {
                    // 这里需要规范json目录下的二级目录名称按照收集数据的当天日期命名yyyyMMDD
                    resultArr.splice(index, 1, item2);
                // }
            }
        }
    }
    return resultArr;
};

// 格式化数据-foodlist
// https://i.waimai.meituan.com/openh5/poi/food
const deDuplication2 = (res) => {
    if(!res) {
        return [];
    }
    let resultArr = [];
    for(let k=0; k<res.length; k++) {
        let shopItem = res[k].data||{};
        let shopName = shopItem.shopInfo.shopName;
        let data = shopItem.categoryList||[];
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            let categoryName = item.categoryName||'';
            let foodlist = item.spuList || [];
            for (let j = 0; j < foodlist.length; j++) {
                let tempItem = foodlist[j]||{};
                let item2 = {
                    spuName: tempItem.spuName, //商品名称
                    unit: tempItem.unit, //计量单位
                    spuDesc: tempItem.spuDesc, //描述
                    originPrice: tempItem.originPrice, //原价
                    currentPrice: tempItem.currentPrice, //现价
                    praiseNum: tempItem.praiseNumDecoded, //点赞数
                    saleVolumeDecoded: tempItem.saleVolumeDecoded, //月销量
                    categoryName: categoryName, //所属栏目
                    shopName: shopName, //店铺名称
                };
                for (let val in item2) {
                    for (let k = 0; k < realNumberArr.length; k++) {
                        item2[val] = item2[val]||'';
                        item2[val] = item2[val].toString();
                        item2[val] = item2[val].replace(new RegExp(realNumberArr[k].key1,'g'), realNumberArr[k].key2);
                    }
                }
                resultArr.push(item2);
            }
        }
    }
    return resultArr;
};

// 格式化数据-shopList
// https://i.waimai.meituan.com/openh5/search/poi
const deDuplication3 = (data) => {
    if(!data) {
        return [];
    }
    let shopNameArr = [];
    let resultArr = []; //店铺信息
    let resultArr2 = []; //热销菜品信息
    for (let i = 0; i < data.length; i++) {
        let item = data[i];
        let parentFileName = item.parentFileName;
        item.data = item.data || {};
        let shopList = item.data.searchPoiList || [];
        for (let j = 0; j < shopList.length; j++) {
            let tempItem = shopList[j]||{};
            let item2 = {
                shopName: tempItem.name, //店铺名称
                wmPoiScore: tempItem.wmPoiScore, //星评
                monthSalesTip: tempItem.monthSalesTip, //月销量
                minPriceTip: tempItem.minPriceTip, //起送价格
                averagePriceTip: tempItem.averagePriceTip, //人均
                discounts2: tempItem.activityList, //优惠活动
                thirdCategory: tempItem.thirdCategory, //店铺类别
            };
            item2.parentFileName = parentFileName;
            // 热销菜品信息
            let foodList = [];
            let tempFoodList = tempItem.productList||[];
            for(let n=0; n<tempFoodList.length; n++) {
                let item = tempFoodList[n];
                let food = {
                    spuName: item.productName, //商品名称
                    originPrice: item.originalPrice, //原价
                    currentPrice: item.price, //现价
                    praiseNum: item.praiseContent, //点赞数
                    saleVolumeDecoded: item.monthSalesDecoded, //月销量
                    promotionInfo: item.promotionInfo, //折扣
                    categoryName: item2.thirdCategory, //所属栏目
                    shopName: item2.shopName, //店铺名称
                };
                // 数字解密
                for (let val in food) {
                    for (let k = 0; k < realNumberArr.length; k++) {
                        food[val] = food[val].toString();
                        food[val] = food[val].replace(new RegExp(realNumberArr[k].key1,'g'), realNumberArr[k].key2);
                    }
                }
                foodList.push(food);
            }

            // 处理优惠活动信息
            let discounts2 = '';
            if(item2.discounts2 != null) {
                for (let k = 0; k < item2.discounts2.length; k++) {
                    discounts2 += item2.discounts2[k].info + ';';
                }
            }
            item2.discounts2 = discounts2;

            // 处理月销量信息
            let monthSalesTip = '';
            monthSalesTip = item2.monthSalesTip.replace('月售', '');
            item2.monthSalesTip = monthSalesTip;

            // 数字解密
            for (let val in item2) {
                for (let k = 0; k < realNumberArr.length; k++) {
                    item2[val] = item2[val].toString();
                    item2[val] = item2[val].replace(new RegExp(realNumberArr[k].key1,'g'), realNumberArr[k].key2);
                }
            }

            // 用店名去重 shopName
            let index = shopNameArr.indexOf(item2.shopName);
            if (index === -1) {
                shopNameArr.push(item2.shopName);
                resultArr.push(item2);
                resultArr2.push.apply(resultArr2, foodList);
            } else {
                // if (!isNaN(item2.parentFileName) && !isNaN(resultArr[index].parentFileName) && item2.parentFileName > resultArr[index].parentFileName) {
                    // 这里需要规范json目录下的二级目录名称按照收集数据的当天日期命名yyyyMMDD
                    resultArr.splice(index, 1, item2);
                // }
            }
        }
    }
    return {
        shopInfo: resultArr,
        foodInfo: resultArr2
    };
};

// 读取单个json文件
const parse = (file) => {
    let filePath = path.resolve(file); // 原始文件地址
    let fileMimeType = mimeType.lookup(filePath); // 获取文件的 memeType
    let fileName = filePath.split('\\').slice(-1)[0].split('/').slice(-1)[0].split('.')[0]; // 提取文件名
    let parentFileName = filePath.split('\\').slice(-1)[0].split('/').slice(-2)[0];
    let returnData = {
        fileName: fileName,
        data: [],
        parentFileName: parentFileName
    };
    let result = [];
    // 如果不是json文件，则跳过
    if (!fileMimeType.toString().includes("json")) {
        console.log(`Failed! ${filePath}:\tNot json file!`);
    } else {
        // 读取json文件
        let buffer = fs.readFileSync(filePath, 'utf-8');
        let json = JSON.stringify(buffer);
        json = JSON.parse(json);
        json = JSON.parse(json);
        result = json.data || {};
    }
    // resolve();
    returnData.data = result;
    return returnData;
};
// 读取整个目录下的json文件
const dirEach = (dir) => {
    let pa = fs.readdirSync(dir);
    let resultData = [];
    pa.forEach((item, index) => {
        let itemPath = path.resolve(dir + '/' + item);
        let stat = fs.statSync(itemPath);
        if (stat.isDirectory()) {
            let itemData = dirEach(itemPath);
            resultData.push.apply(resultData, itemData);
        } else {
            let itemData = parse(itemPath);
            resultData.push(itemData);
        }
    });
    return resultData;
};

const getWoff = (filePath) => {
    let buffer = fs.readFileSync(filePath, 'utf-8');
    let json = JSON.stringify(buffer);
    json = JSON.parse(json);
    json = JSON.parse(json);
    return json;
};

const getJsonService = {
    async getData(path, type) {
        let res = {};
        let file = path;
        if(type === 'shopList') {
            file += '/shopList';
        } else if(type === 'foodList') {
            file += '/foodList';
        } else if(type === 'searchList') {
            file += '/searchList';
        }
        let isExists1 = await getStat(file);
        if(!isExists1) {
            // 路径不存在
            res = {
                code: '7000',
                data: 'source路径不存在'
            }
            return res;
        }
        const woffPath = `${path}/woff.json`;
        let isExists2 = await getStat(woffPath);
        if(!isExists2) {
            // 文件不存在
            res = {
                code: '7000',
                data: 'woff解密文件不存在'
            }
            return res;
        }
        
        // 读取woff解密枚举
        realNumberArr = await getWoff(woffPath);
        let resultData = {};
        // 读取文件
        const stat = fs.lstatSync(file);
        // 如果是文件则直接解析
        if (stat.isFile()) {
            resultData = await parse(file);
        }
        // 如果是目录则遍历目录下的图片文件并逐个进行解析
        if (stat.isDirectory()) {
            resultData = await dirEach(file);
        }
        if(type === 'shopList') {
            resultData = deDuplication1(resultData);
        } else if(type === 'foodList') {
            resultData = deDuplication2(resultData);
        } else if(type === 'searchList') {
            resultData = deDuplication3(resultData);
        } else {
            resultData = [];
        }
        res = {
            code: 5000,
            data: resultData
        };
        return res;
    }
}

module.exports = getJsonService;