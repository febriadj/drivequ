const UserModel = require('../../database/models/user');
const response = require('../../helpers/response');

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      const newError = {
        code: 417,
        message: 'server requires token in header',
      };
      throw newError;
    }

    const key = header.split(' ')[1];
    const user = await UserModel.findOne({ accessKeyId: { $eq: key } });

    req.user = user;
    next();
  }
  catch (error0) {
    response({
      res,
      httpStatusCode: error0.code || 401,
      success: false,
      message: error0.message,
    });
  }
};
