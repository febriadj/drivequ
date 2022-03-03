const path = require('path');
const fs = require('fs');
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

      mv(filepath, `uploads/${filename}`, { mkdirp: true }, async (error2) => {
        try {
          if (error2) throw error2;

          const document = await new DocModel({
            filename: newFilename,
            originalFilename,
            format,
            location,
            url: `/${filename}`,
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
            { _id: { $eq: q.id } },
            { trashed: { $eq: q.trashed ?? false } },
          ],
        }).sort({ filename: 1 });
      }
      else if (q.location) {
        documents = await DocModel.find({
          $and: [
            { location: { $eq: q.location } },
            { trashed: { $eq: q.trashed ?? false } },
          ],
        }).sort({ filename: 1 });
      }
      else if (q.url) {
        documents = await DocModel.findOne({
          $and: [
            { url: { $eq: q.url } },
            { trashed: { $eq: q.trashed ?? false } },
          ],
        }).sort({ filename: 1 });
      }
    }
    else {
      documents = await DocModel.find().sort({ filename: 1 });
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
    const file = await path.resolve(__dirname, `../../../uploads/${req.params.filename}`);
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

exports.delete = async (req, res) => {
  try {
    const updated = await DocModel.updateMany(
      { _id: { $in: req.body } },
      { $set: { trashed: true } },
      { multi: true },
    );

    const documents = await DocModel.find({ _id: { $in: req.body } });

    let i = 0;
    while (i < documents.length) {
      const rootDir = path.resolve(__dirname, '../../../uploads');
      const files = `${rootDir}/${documents[i].filename}.${documents[i].format}`;

      if (fs.existsSync(files)) fs.unlinkSync(files);
      i += 1;
    }

    response({
      res,
      message: 'Document deleted successfully',
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
