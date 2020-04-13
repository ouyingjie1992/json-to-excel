/**
 * 生成excel
 */
const fs = require("fs");
const path = require("path");
const xlsx = require("node-xlsx");

// 店铺Excel
const options1 = {
	"!cols": [
		{ wch: 40 },
		{ wch: 5 },
		{ wch: 12 },
		{ wch: 12 },
		{ wch: 12 },
		{ wch: 79 },
	],
}; //设置表格宽度
const tableModel1 = [
	{
		name: "店铺名称",
		value: "shopName",
	},
	{
		name: "星评",
		value: "wmPoiScore",
	},
	{
		name: "月销量",
		value: "monthSalesTip",
	},
	{
		name: "起送价格",
		value: "minPriceTip",
	},
	{
		name: "人均",
		value: "averagePriceTip",
	},
	{
		name: "优惠活动",
		value: "discounts2", //数组
	},
];

// 商品Excel
const options2 = {
	"!cols": [
		{ wch: 40 },
		{ wch: 40 },
		{ wch: 10 },
		{ wch: 40 },
		{ wch: 12 },
		{ wch: 12 },
		{ wch: 10 },
		{ wch: 10 },
		{ wch: 10 },
	],
}; //设置表格宽度
const tableModel2 = [
	{
		name: "商品名称",
		value: "spuName",
	},
	{
		name: "店铺名称",
		value: "shopName", //数组
	},
	{
		name: "计量单位",
		value: "unit",
	},
	{
		name: "描述",
		value: "spuDesc",
	},
	{
		name: "原价",
		value: "originPrice",
	},
	{
		name: "现价",
		value: "currentPrice",
	},
	{
		name: "点赞数",
		value: "praiseNum", //数组
	},
	{
		name: "月销量",
		value: "saleVolumeDecoded", //数组
	},
	{
		name: "所属栏目",
		value: "categoryName", //数组
	},
];

// 搜索页面-店铺Excel
const options3 = {
	"!cols": [
		{ wch: 40 },
		{ wch: 5 },
		{ wch: 12 },
		{ wch: 12 },
		{ wch: 12 },
		{ wch: 79 },
		{ wch: 12 },
	],
}; //设置表格宽度
const tableModel3 = [
	{
		name: "店铺名称",
		value: "shopName",
	},
	{
		name: "星评",
		value: "wmPoiScore",
	},
	{
		name: "月销量",
		value: "monthSalesTip",
	},
	{
		name: "起送价格",
		value: "minPriceTip",
	},
	{
		name: "人均",
		value: "averagePriceTip",
	},
	{
		name: "优惠活动",
		value: "discounts2", //数组
	},
	{
		name: "店铺类别",
		value: "thirdCategory", 
	},
];
// 搜索页面-热销商品Excel
const options4 = {
	"!cols": [
		{ wch: 40 },
		{ wch: 12 },
		{ wch: 12 },
		{ wch: 12 },
		{ wch: 12 },
		{ wch: 12 },
		{ wch: 12 },
		{ wch: 40 },
	],
}; //设置表格宽度
const tableModel4 = [
	{
		name: "商品名称",
		value: "spuName",
	},
	{
		name: "原价",
		value: "originPrice",
	},
	{
		name: "现价",
		value: "currentPrice",
	},
	{
		name: "点赞数",
		value: "praiseNum",
	},
	{
		name: "月销量",
		value: "saleVolumeDecoded",
	},
	{
		name: "折扣",
		value: "promotionInfo", //数组
	},
	{
		name: "所属栏目",
		value: "categoryName", 
	},
	{
		name: "店铺名称",
		value: "shopName", 
	},
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

/**
 * 创建路径
 * @param {string} dir 路径
 */
const mkdir = (dir) => {
	return new Promise((resolve, reject) => {
		fs.mkdir(dir, (err) => {
			if (err) {
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});
};

/**
 * 路径是否存在，不存在则创建
 * @param {string} dir 路径
 */
async function dirExists(dir) {
	let isExists = await getStat(dir);
	//如果该路径存在且不是文件，返回true
	if (isExists && isExists.isDirectory()) {
		return true;
	} else if (isExists) {
		//如果该路径存在但是文件，返回false
		return false;
	}
	//如果该路径不存在
	let tempDir = path.parse(dir).dir; //拿到上级路径
	//递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
	let status = await dirExists(tempDir);
	let mkdirStatus;
	if (status) {
		mkdirStatus = await mkdir(dir);
	}
	return mkdirStatus;
}

const createExcelService = {
	async createFile(fileName, data, type, savefileName) {

        const initOption = (tableName, tableModel, data, options) => {
            let option = {};
            let tableData = [];
            // tableData = [
            //     ['name', 'sex', 'age'],
            //     ['zs', 'man', '19'],
            //     ['ls', 'man', '28']
            // ];
            // 构建表头
            let tableTheadData = [];
            for (let i = 0; i < tableModel.length; i++) {
                tableTheadData.push(tableModel[i].name);
            }
            tableData.push(tableTheadData);
            // 填充数据
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                let tempList = [];
                for (let k = 0; k < tableModel.length; k++) {
                    tempList.push(item[tableModel[k].value]);
                }
                tableData.push(tempList);
            }
            option = { 
                name: tableName, 
                data: tableData,
                options: options
            }
            return option;
        };
        let optionObj = [];
		if (type === "shopList") {
            let tempObj = initOption('店铺信息', tableModel1, data, options1);
            optionObj.push(tempObj);
		} else if (type === "foodList") {
            let tempObj = initOption('菜单信息', tableModel2, data, options2);
            optionObj.push(tempObj);
		} else if (type === "searchList") {
            let tempObj = initOption('店铺信息', tableModel3, data.shopInfo, options3);
            optionObj.push(tempObj);
            let tempObj2 = initOption('热销菜品信息', tableModel4, data.foodInfo, options4);
            optionObj.push(tempObj2);
		} else {
			return `文件数据有误:${fileName}`;
		}

		let buffer = xlsx.build(optionObj); //生成buffer文件流
		let outPath = `testData/output/`;
		if (savefileName) {
			outPath += `${savefileName}/`;
		}
		await dirExists(outPath);
		let outPathReal = path.resolve(outPath);
		// console.log(fileName)
		let outFileName = ``;
		if (type === "shopList") {
			outFileName = `shopList`;
		} else if (type === "foodList") {
			outFileName = `foodList`;
		} else if (type === "searchList") {
			outFileName = `searchList`;
		}
		outFileName += `.xlsx`;
		// outFileName += `-${fileName}.xlsx`;
		let outFile = path.join(outPathReal, outFileName);
		fs.access(outFile, (err) => {
			if (err) {
				//文件不存在
				//将buffer文件生成excel表格
				fs.writeFileSync(outFile, buffer);
			} else {
				//文件存在,删除文件
				fs.unlink(outFile, (err) => {
					//将buffer文件生成excel表格
					fs.writeFileSync(outFile, buffer);
				});
			}
		});
		return `文件输出成功！${outFile}`;
	},
};

module.exports = createExcelService;
