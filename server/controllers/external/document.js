const path = require('path');
const fs = require('fs');
const mv = require('mv');
const DocModel = require('../../database/models/document');
const response = require('../../helpers/response');

exports.insert = async (req, res) => {
  try {
    const {
      location = '/',
      permission = 'public',
      parents = [],
      file: {
        newFilename,
        originalFilename,
        filepath,
        size,
        mimetype,
      },
    } = req.body;

    if (permission !== 'public' && permission !== 'private') {
      const newError = {
        message: 'Permission must be "private" or "public"',
      };
      throw newError;
    }

    const format = originalFilename.split('.').reverse()[0];
    const filename = `${newFilename}.${format}`;

    mv(filepath, `uploads/${filename}`, { mkdirp: true }, async (error1) => {
      try {
        if (error1) throw error1;

        const document = await new DocModel({
          userId: req.user._id,
          filename: newFilename,
          originalFilename,
          format,
          location,
          url: `/${filename}`,
          parents: parents.length > 0 ? parents.split(',') : [],
          mimetype,
          size,
          permission,
        }).save();

        response({
          res,
          message: 'Document added successfully',
          payload: document,
        });
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
  catch (error0) {
    response({
      res,
      httpStatusCode: error0.statusCode || 400,
      success: false,
      message: error0.message,
    });
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
            { userId: { $eq: req.user._id } },
            { _id: { $eq: q.id } },
            { trashed: { $eq: !!q.trashed } },
          ],
        }).sort({ filename: 1 });
      }
      else if (q.location) {
        documents = await DocModel.find({
          $and: [
            { userId: { $eq: req.user._id } },
            { location: { $eq: q.location } },
            { trashed: { $eq: !!q.trashed } },
          ],
        }).sort({ filename: 1 });
      }
      else if (q.url) {
        documents = await DocModel.findOne({
          $and: [
            { userId: { $eq: req.user._id } },
            { url: { $eq: q.url } },
            { trashed: { $eq: !!q.trashed } },
          ],
        }).sort({ filename: 1 });
      }
      else if (q.permission) {
        documents = await DocModel.findOne({
          $and: [
            { userId: { $eq: req.user._id } },
            { permission: { $eq: q.permission } },
            { trashed: { $eq: !!q.trashed } },
          ],
        }).sort({ filename: 1 });
      }
      else {
        documents = await DocModel.find({
          $and: [
            { userId: { $eq: req.user._id } },
            { trashed: { $eq: !!q.trashed } },
          ],
        }).sort({ filename: 1 });
      }
    }
    else {
      documents = await DocModel.find({
        userId: { $eq: req.user._id },
      }).sort({ filename: 1 });
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
    const file = await path.resolve(__dirname, `../../../uploads/${req.params.filename}`);
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

exports.trashing = async (req, res) => {
  try {
    const updated = await DocModel.updateMany(
      {
        $and: [
          { userId: { $eq: req.user._id } },
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

exports.delete = async (req, res) => {
  try {
    const query = {
      $and: [
        { userId: { $eq: req.user._id } },
        { _id: { $in: req.body } },
      ],
    };

    const docs = await DocModel.find(query);
    await DocModel.deleteMany(query);

    const root = path.resolve(__dirname, '../../../uploads');

    let i = 0;
    while (i < docs.length) {
      const src = `${root}/${docs[i].filename}.${docs[i].format}`;
      if (fs.existsSync(src)) fs.unlinkSync(src);
      i += 1;
    }

    response({
      res,
      message: 'document deleted successfully',
      payload: docs,
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
