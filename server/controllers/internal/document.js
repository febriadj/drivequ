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
        location = 'home',
        permission = 'public',
      } = fields;

      const {
        originalFilename,
        filepath,
        size,
        mimetype,
      } = files.file;

      if (permission !== 'public' || permission !== 'private') {
        const newError = {
          message: 'Permission must be "private" or "public"',
        };
        throw newError;
      }

      const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const nameArr = [];

      let i = 0;
      while (i < 12) {
        nameArr.push(alpha.charAt(Math.floor(Math.random() * alpha.length)));
        i += 1;
      }

      const format = originalFilename.split('.').reverse()[0];
      const filename = `${nameArr.join('')}.${format}`;

      await mv(filepath, `uploads/${filename}`, { mkdirp: true });

      const document = await new DocModel({
        filename: nameArr.join(''),
        format,
        location,
        url: location === 'home' ? `/${filename}` : `/${location}/${filename}`,
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
    const documents = await DocModel.find().sort({ createdAt: -1 });
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
