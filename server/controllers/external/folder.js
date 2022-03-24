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
      userId: req.user_id,
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

    console.log(req.user);

    let folders;

    if (queryExists) {
      if (q.id) {
        folders = await FolderModel.findOne({
          $and: [
            { userId: { $eq: req.user._id } },
            { _id: { $eq: q.id } },
            { trashed: { $eq: !!q.trashed } },
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
            { userId: { $eq: req.user._id } },
            { trashed: { $eq: !!q.trashed } },
          ],
        }).sort({ name: 1 });
      }
      else if (q.url) {
        folders = await FolderModel.findOne({
          $and: [
            { userId: { $eq: req.user._id } },
            { url: { $eq: q.url } },
            { trashed: { $eq: !!q.trashed } },
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
            { userId: { $eq: req.user._id } },
            { trashed: { $eq: !!q.trashed } },
          ],
        }).sort({ name: 1 });
      }
      else {
        folders = await FolderModel.find({
          $and: [
            { userId: { $eq: req.user._id } },
            { trashed: { $eq: !!q.trashed } },
          ],
        }).sort({ name: 1 });
      }
    } else {
      folders = await FolderModel.find({
        userId: { $eq: req.user._id },
      }).sort({ name: 1 });
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
      httpStatusCode: error0.statusCode || 400,
      success: false,
      message: error0.message,
    });
  }
};
