module.exports = {
  port: 5050,
  database: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/cloudsync',
  },
};
