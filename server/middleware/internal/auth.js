const jwt = require('jsonwebtoken');
const response = require('../../helpers/response');

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      const newError = {
        code: 417,
        message: 'Server requires token in header',
      };
      throw newError;
    }

    const token = header.split(' ')[1];
    req.user = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);

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
