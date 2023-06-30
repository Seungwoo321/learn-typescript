const config = require('../config');
const services = require('../services/remote')
const buildMonthArrayFromLatest = require('../utils/buildMonthArrayFromLatest');

const getMonthsHandler = async (ctx) => {
  try {
    const tblId = config.kosis.DT_1C8016.OPTIONS.tblId
    const result = await services.getLatestByIndicator(tblId, 'A01', 1)
    ctx.body = buildMonthArrayFromLatest(result[0].month)
  } catch (error) {
    ctx.body = error
  }
}

const getIndexCompositionsHandler = async (ctx) => {
  try {
    const { month, indexName } = ctx.params
    const userStatsId = config.kosis.DT_1C8016.USER_STATS_ID[indexName]
    const result = await services.getUserStatsByMonth(month, userStatsId)
    ctx.body = result
  } catch (error) {
    ctx.body = error
  }
}

module.exports = {
  getMonthsHandler,
  getIndexCompositionsHandler
}