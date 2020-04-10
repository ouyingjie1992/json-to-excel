const router = require("koa-router")();
const analysisCtrl = require("../app/controller/analysis");

router.get("/", async (ctx, next) => {
	await ctx.render("index", {
		title: "Hello Koa 2!",
	});
});

router.get("/jsonToExcel", async (ctx, next) => {
    // 解析json转化excel
    let query = ctx.query||{};
    let fileName = query.fileName||'';
    let res = await analysisCtrl.jsonToExcel(fileName);
	ctx.body = res;
});

router.get("/woffToJson", async (ctx, next) => {
    // 解析woff转化json
    let query = ctx.query||{};
    let fileName = query.fileName||'';
    let res = await analysisCtrl.woffToJson(fileName);
	ctx.body = res;
});

router.get("/createExcel", async (ctx, next) => {
    // 生成Excel
    let query = ctx.query||{};
    let fileName = query.fileName||'';
    let res = await analysisCtrl.woffToJson(fileName);
    let res2 = {};
    if(res.code === 5000) {
        res2 = await analysisCtrl.jsonToExcel(fileName);
    }
	ctx.body = res2;
});

module.exports = router;
