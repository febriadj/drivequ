const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  isDev,
  port: 5050,
  database: {
    uri: {
      prod: process.env.MONGO_URI,
      dev: 'mongodb://localhost:27017/drivequ',
    },
  },
  fileUpload: {
    max: 2 * 1000 * 1000, // 2 mb
    types: [
      'application',
      'text',
      'image',
      'audio',
    ],
  },
};
