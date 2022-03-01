const path = require('path');
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
          _id: { $eq: q.id },
        }).sort({ filename: 1 });
      }
      else if (q.location) {
        documents = await DocModel.find({
          location: {
            $eq: q.location,
          },
        }).sort({ filename: 1 });
      }
      else if (q.url) {
        documents = await DocModel.findOne({
          location: { $eq: q.uql },
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
