const { model, Schema } = require('mongoose');

const DocModel = model('documents', new Schema({
  filename: {
    type: Schema.Types.String,
    trim: true,
    required: true,
    unique: true,
  },
  originalFilename: {
    type: Schema.Types.String,
    trim: true,
    required: true,
  },
  format: {
    type: Schema.Types.String,
    default: '',
  },
  location: {
    type: Schema.Types.String,
    required: true,
    default: '/',
  },
  url: {
    type: Schema.Types.String,
    required: true,
  },
  mimetype: {
    type: Schema.Types.String,
    default: '',
  },
  type: {
    type: Schema.Types.String,
    default: 'file',
  },
  size: {
    type: Schema.Types.Number,
    required: true,
    default: 0,
  },
  permission: {
    type: Schema.Types.String,
    enum: ['public', 'private'],
    default: 'public',
  },
  trashed: {
    type: Schema.Types.Boolean,
    default: false,
  },
}, {
  timestamps: true,
}));

module.exports = DocModel;
