const jwt = require('jsonwebtoken');
const response = require('../helpers/response');

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      const newError = {
        message: '',
      };
      throw newError;
    }

    const token = header.split(' ')[1];
    req.user = await jwt.verify(token, '091u2bihasd90u23123');

    next();
  }
  catch (error0) {
    response({
      res,
      message: error0.message,
      success: false,
      httpStatusCode: 401,
    });
  }
};
