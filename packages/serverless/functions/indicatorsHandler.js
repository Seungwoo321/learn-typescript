const config = require('../config')
const services = require('../services/remote')

const getLatestIndicatorsHandler = async (ctx) => {
  try {
    const tblId = config.kosis.DT_1C8016.OPTIONS.tblId
    const { code } = ctx.params
    const result = await services.getLatestByIndicator(tblId, code)
    ctx.body = result
  } catch (error) {
    ctx.body = error
  }
}

module.exports = {
  getLatestIndicatorsHandler
}