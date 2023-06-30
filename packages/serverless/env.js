require('dotenv').config();

const env = {

  get(key) {
    return process.env[key];
  },
  getInt(key) {
    return parseInt(process.env[key], 10);
  },
  getFloat(key) {
    return parseFloat(process.env[key]);
  },
  getBoolean(key) {
    return process.env[key].toLowerCase() === 'true';
  },
};

module.exports = env;
