const { model, Schema } = require('mongoose');

const FolderModel = model('folders', new Schema({
  name: {
    type: Schema.Types.String,
    trim: true,
    required: true,
    unique: true,
  },
  url: {
    type: Schema.Types.String,
    unique: true,
  },
  permission: {
    type: Schema.Types.String,
    enum: ['public', 'private'],
    default: 'public',
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
}, {
  timestamps: true,
}));

module.exports = FolderModel;
