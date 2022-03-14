const { model, Schema } = require('mongoose');

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
      required: true,
    },
    last: {
      type: Schema.Types.String,
      trim: true,
      required: true,
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
  accessKeyId: {
    type: Schema.Types.String,
    unique: true,
  },
}, {
  timestamps: true,
}));

module.exports = UserModel;
