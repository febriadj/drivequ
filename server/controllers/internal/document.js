const nodePath = require('path');
const DocModel = require('../../database/models/document');
const FolderModel = require('../../database/models/folder');

const response = require('../../helpers/response');
const fileUpload = require('../../middleware/internal/fileUpload');

exports.insert = async (req, res) => {
  fileUpload.array('file')(req, res, async (error1) => {
    try {
      if (error1) throw error1;

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

      for (let i = 0; i < req.files.length; i += 1) {
        req.files[i] = {
          ...req.files[i],
          userId: req.user.id,
          filename: req.files[i].newFilename,
          parents: location === '/' ? [] : [...currFolder.parents, currFolder._id.toString()],
          path: location === '/' ? ['/'] : currFolder.path,
          location,
        };
      }

      await DocModel.insertMany(req.files);

      response({
        res,
        message: 'Document added successfully',
        payload: {
          files: req.files.length,
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
  });
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
            { userId: { $eq: req.user.id } },
            { _id: { $eq: q.id } },
            { trashed: { $eq: q.trashed ?? false } },
          ],
        }).sort({ createdAt: -1 });
      }
      else if (q.location) {
        documents = await DocModel.find({
          $and: [
            { userId: { $eq: req.user.id } },
            { location: { $eq: q.location } },
            { trashed: { $eq: q.trashed ?? false } },
          ],
        }).sort({ createdAt: -1 });
      }
      else if (q.filename) {
        const regexQuery = (
          args = '',
        ) => ({
          $regex: new RegExp(req.query.filename),
          $options: args,
        });

        documents = await DocModel.find({
          $and: [
            { userId: { $eq: req.user.id } },
            { trashed: { $eq: q.trashed ?? false } },
            {
              $or: [
                { filename: regexQuery('') },
                { originalname: regexQuery('i') },
              ],
            },
          ],
        }).sort({ createdAt: -1 });
      }
      else if (q.url) {
        documents = await DocModel.findOne({
          $and: [
            { userId: { $eq: req.user.id } },
            { url: { $eq: q.url } },
            { trashed: { $eq: q.trashed ?? false } },
          ],
        }).sort({ createdAt: -1 });
      }
      else {
        documents = await DocModel.find({
          $and: [
            { userId: { $eq: req.user.id } },
            { trashed: { $eq: q.trashed ?? false } },
          ],
        }).sort({ createdAt: -1 });
      }
    }
    else {
      documents = await DocModel.find({
        userId: { $eq: req.user.id },
      }).sort({ createdAt: -1 });
    }

    response({
      res,
      message: 'Request successful',
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

exports.trashed = async (req, res) => {
  try {
    const updated = await DocModel.updateMany(
      {
        $and: [
          { userId: { $eq: req.user.id } },
          { _id: { $in: req.body } },
        ],
      },
      { $set: { trashed: true } },
      { multi: true },
    );

    response({
      res,
      message: 'document successfully moved to trash',
      payload: updated,
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

exports.size = async (req, res) => {
  try {
    const documents = await DocModel.find({
      $and: [
        { userId: req.user.id },
        { trashed: { $eq: req.query.trashed } },
      ],
    });

    const result = documents.map((args) => args.size).reduce((acc, curr) => acc + curr);

    response({
      res,
      message: 'Request successful',
      payload: result,
    });
  }
  catch (error0) {
    response({ res, payload: 0 });
  }
};

exports.move = async (req, res) => {
  try {
    const { location = '/' } = req.body;
    let targetFolder;

    if (location !== '/') {
      targetFolder = await FolderModel.findOne({
        $and: [
          { userId: req.user.id },
          { url: location },
        ],
      });
    }

    const documents = await DocModel.updateMany(
      {
        $and: [
          { userId: req.user.id },
          { _id: { $in: req.body.id } },
        ],
      },
      {
        $set: {
          path: location === '/' ? ['/'] : targetFolder.path,
          parents: location === '/' ? [] : [...targetFolder.parents, targetFolder._id.toString()],
          location,
        },
      },
      { multi: true },
    );

    response({
      res,
      message: 'Successfully updated documents',
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
