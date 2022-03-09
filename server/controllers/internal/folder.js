const { v4: uuidv4 } = require('uuid');
const FolderModel = require('../../database/models/folder');
const response = require('../../helpers/response');

exports.insert = async (req, res) => {
  try {
    const {
      name,
      permission = 'public',
      description = '',
      location,
      path,
      parents = [],
    } = req.body;

    const folder = await new FolderModel({
      name,
      url: `/${uuidv4()}`,
      permission,
      description,
      location,
      path,
      parents,
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
      if (q.id) {
        folders = await FolderModel.findOne({
          $and: [
            { _id: { $eq: q.id } },
            { trashed: { $eq: q.trashed ?? false } },
          ],
        });
      }
      else if (q.name) {
        folders = await FolderModel.find({
          $and: [
            {
              name: {
                $regex: new RegExp(q.name),
                $options: 'i',
              },
            },
            { trashed: { $eq: q.trashed ?? false } },
          ],
        }).sort({ name: 1 });
      }
      if (q.url) {
        folders = await FolderModel.findOne({
          $and: [
            { url: { $eq: q.url } },
            { trashed: { $eq: q.trashed ?? false } },
          ],
        }).sort({ name: 1 });
      }
      else if (q.location) {
        folders = await FolderModel.find({
          $and: [
            {
              $expr: {
                $eq: [{ $last: '$location' }, q.location],
              },
            },
            { trashed: { $eq: q.trashed ?? false } },
          ],
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
