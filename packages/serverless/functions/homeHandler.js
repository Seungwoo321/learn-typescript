
const getHome = async (ctx) => {
  ctx.body = 'Hello, World! Serverless';
};

module.exports = {
  getHome
};