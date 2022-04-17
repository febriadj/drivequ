const { v4: uuidv4 } = require('uuid');
const FolderModel = require('../../database/models/folder');
const response = require('../../helpers/response');

exports.insert = async (req, res) => {
  try {
    const {
      name,
      description = '',
      location = '/',
    } = req.body;

    if (name.length > 30) {
      const newError = {
        message: 'Can\'t be longer than 30 characters',
      };
      throw newError;
    }

    let currFolder;
    if (location !== '/') {
      currFolder = await FolderModel.findOne({
        $and: [
          { userId: req.user.id },
          { url: location },
        ],
      });
    }

    const folderNameExists = await FolderModel.findOne({
      $and: [
        { userId: req.user.id },
        { name },
        { $expr: { $eq: [{ $last: '$location' }, location] } },
      ],
    });

    if (folderNameExists) {
      const newError = {
        message: 'You cannot give the same folder name in the same location',
      };
      throw newError;
    }

    const folder = await new FolderModel({
      userId: req.user.id,
      name,
      url: `/${uuidv4()}`,
      description,
      location: location === '/' ? ['/'] : [...currFolder.location, location],
      path: location === '/' ? ['/', name] : [...currFolder.path, name],
      parents: location === '/' ? [] : [...currFolder.parents, currFolder._id.toString()],
    }).save();

    response({
      res,
      message: 'Folder added successfully',
      payload: folder,
    });
  }
  catch (error0) {
    const { statusCode, message } = error0;

    response({
      res,
      success: false,
      message,
      httpStatusCode: statusCode || 400,
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
            { userId: { $eq: req.user.id } },
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
            { userId: { $eq: req.user.id } },
            { trashed: { $eq: q.trashed ?? false } },
          ],
        }).sort({ name: 1 });
      }
      if (q.url) {
        folders = await FolderModel.findOne({
          $and: [
            { userId: { $eq: req.user.id } },
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
            { userId: { $eq: req.user.id } },
            { trashed: { $eq: q.trashed ?? false } },
          ],
        }).sort({ name: 1 });
      }
    } else {
      folders = await FolderModel.find({
        userId: req.user.id,
      }).sort({ name: 1 });
    }

    response({
      res,
      message: 'Request successful',
      payload: folders,
    });
  }
  catch (error0) {
    const { statusCode, message } = error0;

    response({
      res,
      success: false,
      message,
      httpStatusCode: statusCode || 400,
    });
  }
};
