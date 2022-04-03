const mongoose = require('mongoose');
const config = require('../config');

module.exports = async () => {
  try {
    const { uri } = config.database;
    await mongoose.connect(uri);

    console.log('database connected');
  }
  catch (error0) {
    console.error(error0.message);
  }
};
