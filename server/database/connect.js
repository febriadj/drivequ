const mongoose = require('mongoose');

module.exports = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/storage_service';
    await mongoose.connect(uri);

    console.log('database connected');
  }
  catch (error0) {
    console.error(error0.message);
  }
};
