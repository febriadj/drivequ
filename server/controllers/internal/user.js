const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../../database/models/user');
const response = require('../../helpers/response');

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const hash = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const user = await new UserModel({
      email,
      password: hash,
      name: {
        first: name.first,
        last: name.last,
      },
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
      message: error0.message,
      success: false,
      httpStatusCode: 400,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: { $eq: req.body.email } });
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
      message: error0.message,
      success: false,
      httpStatusCode: 400,
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
      message: error0.message,
      success: false,
      httpStatusCode: 400,
    });
  }
};
