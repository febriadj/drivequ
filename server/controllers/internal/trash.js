const path = require('path');
const fs = require('fs');
const DocModel = require('../../database/models/document');
const FolderModel = require('../../database/models/document');

const response = require('../../helpers/response');

exports.find = async (req, res) => {
  try {
    const docs = await DocModel.find({ trashed: { $eq: true } }).sort({ name: 1 });
    const folders = await FolderModel.find({ trashed: { $eq: true } }).sort({ name: 1 });

    const merge = [...docs, ...folders].sort((a, b) => a.name > b.name);

    response({
      res,
      message: '',
      payload: merge,
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

exports.clear = async (req, res) => {
  try {
    const query = {
      $and: [
        { _id: { $in: req.body } },
        { trashed: true },
      ],
    };

    const docs = await DocModel.find(query);

    await DocModel.deleteMany(query);
    await FolderModel.deleteMany(query);

    const root = path.resolve(__dirname, '../../../uploads');

    let i = 0;
    while (i < docs.length) {
      const src = `${root}/${docs[i].filename}.${docs[i].format}`;
      if (fs.existsSync(src)) fs.unlinkSync(src);
      i += 1;
    }

    response({
      res,
      message: 'Trash has been emptied',
      payload: null,
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
