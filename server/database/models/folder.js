const { model, Schema } = require('mongoose');

const FolderModel = model('folders', new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: Schema.Types.String,
    trim: true,
    required: true,
  },
  url: {
    type: Schema.Types.String,
    unique: true,
  },
  privated: {
    type: Schema.Types.Boolean,
    default: false,
  },
  location: {
    type: Schema.Types.Array,
    required: true,
    default: ['/'],
  },
  type: {
    type: Schema.Types.String,
    default: 'folder',
  },
  path: {
    type: Schema.Types.Array,
    required: true,
    default: ['/'],
  },
  description: {
    type: Schema.Types.String,
    default: '',
  },
  trashed: {
    type: Schema.Types.Boolean,
    default: false,
  },
  parents: {
    type: Schema.Types.Array,
    default: [],
  },
}, {
  timestamps: true,
}));

module.exports = FolderModel;
