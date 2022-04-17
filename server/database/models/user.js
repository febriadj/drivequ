const { model, Schema } = require('mongoose');
const randomStr = require('../../helpers/randomStr');

const UserModel = model('users', new Schema({
  email: {
    type: Schema.Types.String,
    trim: true,
    required: true,
    unique: true,
  },
  name: {
    first: {
      type: Schema.Types.String,
      trim: true,
    },
    last: {
      type: Schema.Types.String,
      trim: true,
    },
  },
  avatar: {
    type: Schema.Types.String,
    default: 'avatar.png',
  },
  password: {
    type: Schema.Types.String,
    required: true,
  },
  type: {
    type: Schema.Types.String,
    enum: ['personal', 'business'],
    default: 'personal',
  },
  company: {
    type: Schema.Types.String,
  },
  app: {
    type: Schema.Types.String,
    required: true,
  },
  accessKeyId: {
    type: Schema.Types.String,
    unique: true,
    default: `ST+${randomStr(16)}`,
  },
}, {
  timestamps: true,
}));

module.exports = UserModel;
