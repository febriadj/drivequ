const nodePath = require('path');
const { IncomingForm } = require('formidable');
const mv = require('mv');
const DocModel = require('../../database/models/document');
const response = require('../../helpers/response');

exports.insert = async (req, res) => {
  const form = new IncomingForm({
    multiples: true,
  });

  form.parse(req, async (error1, fields, files) => {
    try {
      if (error1) throw error1;

      const {
        location = '/',
        permission = 'public',
        path = ['/'],
        parents = [],
      } = fields;

      const {
        newFilename,
        originalFilename,
        filepath,
        size,
        mimetype,
      } = files.file;

      if (permission !== 'public' && permission !== 'private') {
        const newError = {
          message: 'Permission must be "private" or "public"',
        };
        throw newError;
      }

      const format = originalFilename.split('.').reverse()[0];
      const filename = `${newFilename}.${format}`;

      mv(filepath, `uploads/${req.user.id}/${filename}`, { mkdirp: true }, async (error2) => {
        try {
          if (error2) throw error2;

          const document = await new DocModel({
            userId: req.user.id,
            filename: newFilename,
            originalFilename,
            format,
            location,
            url: `/${filename}`,
            parents: parents.length > 0 ? parents.split(',') : [],
            path: path.length > 1 ? path.split(',') : ['/'],
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
        catch (error3) {
          response({
            res,
            message: error3.message,
            success: false,
            httpStatusCode: 400,
          });
        }
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
        }).sort({ filename: 1 });
      }
      else if (q.location) {
        documents = await DocModel.find({
          $and: [
            { userId: { $eq: req.user.id } },
            { location: { $eq: q.location } },
            { trashed: { $eq: q.trashed ?? false } },
          ],
        }).sort({ filename: 1 });
      }
      else if (q.url) {
        documents = await DocModel.findOne({
          $and: [
            { userId: { $eq: req.user.id } },
            { url: { $eq: q.url } },
            { trashed: { $eq: q.trashed ?? false } },
          ],
        }).sort({ filename: 1 });
      }
      else {
        documents = await DocModel.find({
          $and: [
            { userId: { $eq: req.user.id } },
            { trashed: { $eq: q.trashed ?? false } },
          ],
        }).sort({ filename: 1 });
      }
    }
    else {
      documents = await DocModel.find({
        userId: { $eq: req.user.id },
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
      message: error0.message,
      success: false,
      httpStatusCode: 400,
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
      message: error0.message,
      success: false,
      httpStatusCode: 400,
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
      message: error0.message,
      success: false,
      httpStatusCode: 400,
    });
  }
};
