const { model, Schema } = require('mongoose');

const DocModel = model('documents', new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
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
  path: {
    type: Schema.Types.Array,
    required: true,
    default: ['/'],
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
  parents: {
    type: Schema.Types.Array,
    default: [],
  },
  privated: {
    type: Schema.Types.Boolean,
    default: false,
  },
  trashed: {
    type: Schema.Types.Boolean,
    default: false,
  },
}, {
  timestamps: true,
}));

module.exports = DocModel;
