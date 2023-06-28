
module.exports = {
  BASE_URL: 'https://kosis.kr/openapi/Param/statisticsParameterData.do?method=getList',
  PRE_SIGNED_URL: 'https://kosis.kr/openapi/statisticsData.do?method=getList',
  API_KEY: process.env.KOSIS_API_KEY,
  DT_1C8016: {
    OPTIONS: {
      orgId: "101",
      tblId: "DT_1C8016",
      itmId: "T1",
    },
    USER_STATS_ID: {
      leading: process.env.KOSIS_USER_STATS_ID_LEADING,
      coincident: process.env.KOSIS_USER_STATS_ID_COINCIDENT
    }
  }
}
