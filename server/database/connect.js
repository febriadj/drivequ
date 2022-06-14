const { connect } = require('mongoose');
const config = require('../config');

module.exports = async () => {
  try {
    const { isDev, database: { uri: { prod, dev } } } = config;
    await connect(isDev ? dev : prod);

    console.log('database connected');
  }
  catch (error0) {
    console.error(error0.message);
  }
};
