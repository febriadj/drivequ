const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../../database/models/user');
const response = require('../../helpers/response');

exports.register = async (req, res) => {
  try {
    const {
      email, password, name, app, company, accType,
    } = req.body;

    const hash = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const user = await UserModel.findOne({ email: { $eq: email } });

    if (user) {
      const newError = {
        message: 'This email is already in use by another user',
        statusCode: 412,
      };
      throw newError;
    }

    await new UserModel({
      email,
      password: hash,
      name: {
        first: name.first,
        last: name.last,
      },
      app,
      company,
      type: accType,
    }).save();

    response({
      res,
      message: 'Account registered successfully',
      payload: user,
    });
  }
  catch (error0) {
    response({
      res,
      httpStatusCode: error0.statusCode || 400,
      success: false,
      message: error0.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: { $eq: email } });

    if (!user) {
      const newError = {
        message: 'Unregistered user email',
        statusCode: 412,
      };
      throw newError;
    }

    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      const newError = {
        message: 'Password doesn\'t match',
        statusCode: 412,
      };
      throw newError;
    }

    const token = await jwt.sign({ id: user._id }, process.env.JWT_PRIVATE_KEY);

    response({
      res,
      message: 'Login successfully',
      payload: token,
    });
  }
  catch (error0) {
    response({
      res,
      httpStatusCode: error0.statusCode || 400,
      success: false,
      message: error0.message,
    });
  }
};

exports.find = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: { $eq: req.user.id } });
    response({
      res,
      message: 'Request successful',
      payload: user,
    });
  }
  catch (error0) {
    response({
      res,
      httpStatusCode: error0.statusCode || 400,
      success: false,
      message: error0.message,
    });
  }
};
