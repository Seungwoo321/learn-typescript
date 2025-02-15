const config = require('../config')
const axios = require('axios')
const instance = axios.create();

const services = {
  getUserStatsByMonth: async function (month, userStatsId) {
    const response = await instance({
      method: 'get',
      url: config.kosis.PRE_SIGNED_URL,
      params: {
        apiKey: config.kosis.API_KEY,
        userStatsId,
        format: 'json',
        jsonVD: 'Y',
        prdSe: 'M',
        startPrdDe: month,
        endPrdDe: month
      }
    })
    return response.data.map(item => {
      return {
        isMainIndex: item.C1.length === 3,
        code: item.C1,
        codeName: item.C1_NM,
        codeNameEng: item.C1_NM_ENG,
        month: item.PRD_DE,
        value: item.DT
      }
    })
  },
  getLatestByIndicator: async function (tblId, code, period = 24, interval = 1) {
    console.log(tblId, code, period)
    const response = await instance({
      method: 'get',
      url: config.kosis.BASE_URL,
      params: {
        apiKey: config.kosis.API_KEY,
        format: 'json',
        jsonVD: 'Y',
        prdSe: 'M',
        objL1: code,
        newEstPrdCnt: period,
        prdInterval: interval,
        ...config.kosis[tblId].OPTIONS
      }
    })
    return response.data.map(item => {
      return {
        isMainIndex: item.C1.length === 3,
        code: item.C1,
        codeName: item.C1_NM,
        codeNameEng: item.C1_NM_ENG,
        month: item.PRD_DE,
        value: item.DT
      }
    })
  }
}


module.exports = services