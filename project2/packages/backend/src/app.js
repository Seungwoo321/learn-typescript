const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const router = require('./router')
const app = new Koa();

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


app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

app.use(cors());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

router.get('/', async ctx => {
  ctx.body = 'Hello Koa!!'
})

exports.start = async () => {
  try {
    const port = 3000
    await app.listen(port)
    console.log(`Connected on port ${port}`)
  } catch (err) {
    console.log('Something wen wrong')
    console.log(err)
  }
}
