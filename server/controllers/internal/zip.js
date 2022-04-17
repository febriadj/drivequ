const path = require('path');
const fs = require('fs');
const JSZip = require('jszip');

const DocModel = require('../../database/models/document');
const FolderModel = require('../../database/models/folder');
const response = require('../../helpers/response');

exports.create = async (req, res) => {
  try {
    const zip = new JSZip();
    const { payload } = req.body;

    let query = {};

    if (payload && typeof payload === 'object') {
      query = {
        $or: [
          {
            $and: [
              { userId: { $eq: req.user.id } },
              { _id: { $in: payload } },
              { trashed: { $eq: false } },
            ],
          },
          { parents: { $elemMatch: { $in: payload } } },
        ],
      };
    } else {
      query = {
        $and: [{ userId: { $eq: req.user.id } }, { trashed: { $eq: false } }],
      };
    }

    const folders = await FolderModel.find(query);
    const docs = await DocModel.find(query);

    let fName = [];
    for (let i = 0; i < folders.length; i += 1) {
      const parent = folders[i].parents;

      if (parent.length > 0) {
        for (let j = 1; j < folders[i].path.length; j += 1) {
          fName.push(folders[i].path[j]);
        }

        zip.folder(fName.join('/'));
        fName = [];
      } else {
        zip.folder(folders[i].name);
      }
    }

    let dName = [];
    for (let i = 0; i < docs.length; i += 1) {
      const parent = docs[i].parents;

      const filename = `${docs[i].filename}.${docs[i].format}`;
      const raw = fs.readFileSync(`uploads/${req.user.id}/${filename}`);

      if (parent.length > 0) {
        for (let j = 1; j < docs[i].path.length; j += 1) {
          dName.push(docs[i].path[j]);
        }

        zip.file(`${dName.join('/')}/${filename}`, raw);
        dName = [];
      } else {
        zip.file(filename, raw);
      }
    }

    const dir = path.resolve(__dirname, `../../../uploads/${req.user.id}`);

    zip
      .generateNodeStream({ streamFiles: true })
      .pipe(fs.createWriteStream(`${dir}/${req.user.id}.zip`))
      .on('finish', () => {
        response({
          res,
          payload: {
            url: `/api/documents/${req.user.id}/file/${req.user.id}.zip`,
            filename: `${req.user.id}.zip`,
          },
        });
      });
  }
  catch (error0) {
    const { statusCode, message } = error0;

    response({
      res,
      httpStatusCode: statusCode || 400,
      message,
      success: false,
    });
  }
};

exports.delete = (req, res) => {
  try {
    const dir = path.resolve(__dirname, `../../../uploads/${req.user.id}`);
    fs.unlinkSync(`${dir}/${req.user.id}.zip`);
  }
  catch (error0) {
    const { statusCode, message } = error0;

    response({
      res,
      httpStatusCode: statusCode || 400,
      message,
      success: false,
    });
  }
};
