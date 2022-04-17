const nodePath = require('path');
const fs = require('fs');
const mv = require('mv');
const DocModel = require('../../database/models/document');
const FolderModel = require('../../database/models/folder');

const response = require('../../helpers/response');
const randomStr = require('../../helpers/randomStr');

exports.insert = async (req, res) => {
  const qExists = Object.keys(req.query).length > 0;

  const { location = '/' } = req.body;

  let currFolder;
  if (location !== '/') {
    currFolder = await FolderModel.findOne({
      $and: [
        { userId: req.user.id },
        { url: location },
      ],
    });
  }

  function handleAction(
    {
      originalname = null,
      originalFilename = null,
      size,
      mimetype,
      path: filepath1 = null,
      filepath: filepath2 = null,
    },
    callback,
  ) {
    const splitName = originalname ? originalname.split('.') : originalFilename.split('.');
    const format = splitName.length > 1 ? splitName.reverse()[0] : 'txt';

    const filename = randomStr(16);
    const destination = nodePath.resolve(__dirname, '../../../uploads');

    mv(filepath1 || filepath2, `${destination}/${req.user.id}/${filename}.${format}`, { mkdirp: true }, async (error1) => {
      try {
        if (error1) throw error1;

        const document = await new DocModel({
          userId: req.user.id,
          filename,
          originalname: originalname || originalFilename,
          format,
          location,
          url: `/api/documents/${req.user.id}/file/${filename}.${format}`,
          mimetype,
          size,
          path: location === '/' ? ['/'] : currFolder.path,
          parents: location === '/' ? [] : [...currFolder.parents, currFolder._id.toString()],
        }).save();

        callback(document);
      }
      catch (error2) {
        response({
          res,
          httpStatusCode: error2.statusCode || 400,
          success: false,
          message: error2.message,
        });
      }
    });
  }

  if (!qExists || Number(req.query.multiples) === 0) {
    handleAction(req.body.file, (args) => {
      response({
        res,
        message: 'Successfully uploaded file',
        payload: args,
      });
    });
  } else {
    const { length } = req.body.files;

    for (let i = 0; i < length; i += 1) {
      handleAction(req.body.files[i], (args) => {
        if (i >= length - 1) {
          response({
            res,
            message: 'Successfully uploaded files',
            payload: args,
          });
        }
      });
    }
  }
};

exports.find = async (req, res) => {
  try {
    const q = req.query;
    const queryExists = Object.keys(q).length > 0;

    let documents;

    if (queryExists) {
      if (q.id) {
        documents = await DocModel.findOne({
          $and: [
            { userId: req.user.id },
            { _id: q.id },
            { trashed: { $eq: q.trashed ?? false } },
          ],
        }).sort({ createdAt: -1 });
      }
      else if (q.location) {
        documents = await DocModel.find({
          $and: [
            { userId: req.user.id },
            { location: q.location },
            { trashed: { $eq: q.trashed ?? false } },
          ],
        }).sort({ createdAt: -1 });
      }
      else if (q.filename) {
        const regexQuery = (args) => ({
          $regex: new RegExp(req.query.filename),
          $options: args,
        });

        documents = await DocModel.find({
          $and: [
            { userId: req.user.id },
            { trashed: { $eq: q.trashed ?? false } },
            {
              $or: [
                { filename: regexQuery('') },
                { originalFilename: regexQuery('i') },
              ],
            },
          ],
        }).sort({ createdAt: -1 });
      }
      else {
        documents = await DocModel.find({
          $and: [
            { userId: req.user.id },
            { trashed: { $eq: q.trashed ?? false } },
          ],
        }).sort({ createdAt: -1 });
      }
    }
    else {
      documents = await DocModel.find({
        userId: req.user.id,
      }).sort({ createdAt: -1 });
    }

    response({
      res,
      message: 'Request received by server',
      payload: documents,
    });
  }
  catch (error0) {
    response({
      res,
      httpStatusCode: error0.statusCode || 400,
      success: false,
      message: error0.message,
    });
  }
};

exports.open = async (req, res) => {
  try {
    const file = await nodePath.resolve(__dirname, `../../../uploads/${req.params.id}/${req.params.filename}`);
    res.sendFile(file);
  }
  catch (error0) {
    response({
      res,
      httpStatusCode: error0.statusCode || 400,
      success: false,
      message: error0.message,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const query = {
      $and: [
        { userId: { $eq: req.user.id } },
        { _id: { $in: req.body } },
      ],
    };

    const docs = await DocModel.find(query);

    await DocModel.deleteMany(query);
    const root = nodePath.resolve(__dirname, `../../../uploads/${req.user.id}`);

    let i = 0;
    while (i < docs.length) {
      const src = `${root}/${docs[i].filename}.${docs[i].format}`;
      if (fs.existsSync(src)) fs.unlinkSync(src);
      i += 1;
    }

    response({
      res,
      message: 'Successfully delete file',
      payload: {
        files: docs.length,
      },
    });
  }
  catch (error0) {
    response({
      res,
      httpStatusCode: error0.statusCode || 400,
      success: false,
      message: error0.message,
    });
  }
};
