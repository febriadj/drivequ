const { v4: uuidv4 } = require('uuid');
const FolderModel = require('../../database/models/folder');
const response = require('../../helpers/response');

exports.insert = async (req, res) => {
  try {
    const {
      name,
      permission = 'public',
      location,
      path,
    } = req.body;

    const folder = await new FolderModel({
      name,
      url: `/${uuidv4()}`,
      permission,
      location,
      path,
    }).save();

    response({
      res,
      message: 'Folder added successfully',
      payload: folder,
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
    const q = req.query;
    const queryExists = Object.keys(q).length > 0;

    let folders;

    if (queryExists) {
      if (q.url) {
        folders = await FolderModel.findOne({
          url: q.url,
        }).sort({ name: 1 });
      }
      else if (q.name) {
        folders = await FolderModel.find({
          name: {
            $regex: new RegExp(q.name),
            $options: 'i',
          },
        }).sort({ name: 1 });
      }
      else if (q.location) {
        folders = await FolderModel.find({
          $expr: {
            $eq: [{ $last: '$location' }, q.location],
          },
        }).sort({ name: 1 });
      }
    } else {
      folders = await FolderModel.find().sort({ name: 1 });
    }

    response({
      res,
      message: 'Request successful',
      payload: folders,
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
