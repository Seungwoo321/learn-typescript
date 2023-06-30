const env = require('../env')

module.exports = {
  BASE_URL: 'https://kosis.kr/openapi/Param/statisticsParameterData.do?method=getList',
  PRE_SIGNED_URL: 'https://kosis.kr/openapi/statisticsData.do?method=getList',
  API_KEY: env.get('KOSIS_API_KEY'),
  DT_1C8016: {
    OPTIONS: {
      orgId: "101",
      tblId: "DT_1C8016",
      itmId: "T1",
    },
    USER_STATS_ID: {
      leading: env.get('KOSIS_USER_STATS_ID_LEADING'),
      coincident: env.get('KOSIS_USER_STATS_ID_COINCIDENT')
    }
  }
}
