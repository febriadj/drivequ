const path = require('path');
const fs = require('fs');
const DocModel = require('../../database/models/document');
const FolderModel = require('../../database/models/folder');

const response = require('../../helpers/response');

exports.insert = async (req, res) => {
  try {
    const obj = [
      {
        $or: [
          {
            $and: [
              { userId: { $eq: req.user.id } },
              { _id: { $in: req.body } },
              { trashed: { $eq: false } },
            ],
          },
          { parents: { $elemMatch: { $in: req.body } } },
        ],
      },
      { $set: { trashed: true } },
      { multi: true },
    ];

    await DocModel.updateMany(obj[0], obj[1], obj[2]);
    await FolderModel.updateMany(obj[0], obj[1], obj[2]);

    response({
      res,
      message: 'documents and folders successfully moved to trash',
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

exports.find = async (req, res) => {
  try {
    const query = {
      $and: [
        { userId: { $eq: req.user.id } },
        { trashed: { $eq: true } },
      ],
    };

    const docs = await DocModel.find(query).sort({ name: 1 });
    const folders = await FolderModel.find(query).sort({ name: 1 });

    const d = docs.filter((e) => !folders.map(({ url }) => url).includes(e.location));
    const f = folders.filter((e) => (
      !folders.map(({ url }) => url).includes(e.location[e.location.length - 1])
    ));

    const merge = [...d, ...f].sort((a, b) => a.name > b.name);

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

exports.delete = async (req, res) => {
  try {
    const query = {
      $or: [
        {
          $and: [
            { userId: { $eq: req.user.id } },
            { _id: { $in: req.body } },
            { trashed: { $eq: true } },
          ],
        },
        {
          parents: {
            $elemMatch: { $in: req.body },
          },
        },
      ],
    };

    const docs = await DocModel.find(query);

    await DocModel.deleteMany(query);
    await FolderModel.deleteMany(query);

    const root = path.resolve(__dirname, `../../../uploads/${req.user.id}`);

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

exports.recover = async (req, res) => {
  try {
    const obj = [
      {
        $or: [
          {
            $and: [
              { userId: { $eq: req.user.id } },
              { _id: { $in: req.body } },
              { trashed: { $eq: true } },
            ],
          },
          { parents: { $elemMatch: { $in: req.body } } },
        ],
      },
      { $set: { trashed: false } },
      { multi: true },
    ];

    const document = await DocModel.updateMany(obj[0], obj[1], obj[2]);
    const folder = await FolderModel.updateMany(obj[0], obj[1], obj[2]);

    response({
      res,
      message: '',
      payload: { document, folder },
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
