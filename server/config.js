const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  port: 5050,
  database: {
    uri: isDev ? 'mongodb://localhost:27017/cloudsync' : process.env.MONGO_URI,
  },
};
