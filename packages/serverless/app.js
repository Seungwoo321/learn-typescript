const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const createError = require('http-errors');
const app = new Koa();
const Router = require('@koa/router');
const router = new Router();

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(bodyParser());
app.use(cors());


const homeHandler = require('./functions/homeHandler')
const indicatorsHandler = require('./functions/indicatorsHandler');
const monthsHandler = require('./functions/monthsHandler');

router.get('/', homeHandler.getHome);
router.get('/v1/ts-learn/months', monthsHandler.getMonthsHandler);
router.get('/v1/ts-learn/months/:month/indexes/:indexName/compositions', monthsHandler.getIndexCompositionsHandler);
router.get('/v1/ts-learn/indicators/:code/latest', indicatorsHandler.getLatestIndicatorsHandler);

app.use(router.routes());
app.use(router.allowedMethods());

// 404
app.use(async (ctx, next) => {
  next(createError(404));
});

module.exports = app