const Router = require('@koa/router')
const router = new Router()
const config = require('../config')
const services = require('../libs/remote')
const { buildMonthArrayFromLatest } = require('../libs/utils')

router.get('/', async ctx => {
  ctx.body = 'Hello Koa!!'
})

router.get('/ts-learn/months', async ctx => {
  try {
    const tblId = config.DT_1C8016.OPTIONS.tblId
    const result = await services.getLatestByIndicator(tblId, 'A01', 1)
    ctx.body = buildMonthArrayFromLatest(result[0].month)
  } catch (error) {
    ctx.body = error
  }
})

router.get('/ts-learn/months/:month/indexes/:indexName/compositions', async ctx => {
  try {
    const { month, indexName } = ctx.params
    const userStatsId = config.DT_1C8016.USER_STATS_ID[indexName]
    const result = await services.getUserStatsByMonth(month, userStatsId)
    ctx.body = result
  } catch (error) {
    ctx.body = error
  }
})

router.get('/ts-learn/latest/indicators/:code', async ctx => {
  try {
    const tblId = config.DT_1C8016.OPTIONS.tblId
    const code = ctx.params.code
    const result = await services.getLatestByIndicator(tblId, code)
    ctx.body = result
  } catch (error) {
    ctx.body = error
  }
})

module.exports = router