const { model, Schema } = require('mongoose');

const DocModel = model('documents', new Schema({
  filename: {
    type: Schema.Types.String,
    trim: true,
    required: true,
    unique: true,
  },
  format: {
    type: Schema.Types.String,
    default: '',
  },
  location: {
    type: Schema.Types.String,
    default: 'home',
  },
  url: {
    type: Schema.Types.String,
    required: true,
  },
  mimetype: {
    type: Schema.Types.String,
    default: '',
  },
  size: {
    type: Schema.Types.Number,
    required: true,
  },
  permission: {
    type: Schema.Types.String,
    enum: ['public', 'private'],
    default: 'public',
  },
}, {
  timestamps: true,
}));

module.exports = DocModel;
