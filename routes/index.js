const router = require("koa-router")();
const analysisCtrl = require("../app/controller/analysis");

router.get("/", async (ctx, next) => {
	await ctx.render("index", {
		title: "Hello Koa 2!",
	});
});

router.get("/string", async (ctx, next) => {
	ctx.body = "koa2 string";
});

router.get("/json", async (ctx, next) => {
	ctx.body = {
		title: "koa2 json",
	};
});

router.get("/jsonToExcel", async (ctx, next) => {
	//     // 解析json转化excel
	analysisCtrl.jsonToExcel();
	ctx.body = {
		title: "jsonToExcel",
	};
});

module.exports = router;
