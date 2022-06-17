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
    max: 5 * 1024 * 1024, // 5 mb
    types: [
      'application',
      'text',
      'image',
      'audio',
    ],
  },
};
