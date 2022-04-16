const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const nodepath = require('path');

const response = require('../../helpers/response');
const DocModel = require('../../database/models/document');
const FolderModel = require('../../database/models/folder');

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
        { userId: { $eq: req.user.id } },
        { $expr: { $eq: [{ $last: '$location' }, location[location.length - 1]] } },
        { name: { $eq: name } },
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
      message: 'Successfully created a new folder',
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

    let folders;

    if (queryExists) {
      if (q.id) {
        folders = await FolderModel.findOne({
          $and: [
            { userId: req.user.id },
            { _id: q.id },
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
            { userId: req.user.id },
            { trashed: { $eq: q.trashed ?? false } },
          ],
        }).sort({ createdAt: -1 });
      }
      else if (q.url) {
        folders = await FolderModel.findOne({
          $and: [
            { userId: req.user.id },
            { url: q.url },
            { trashed: { $eq: q.trashed ?? false } },
          ],
        }).sort({ createdAt: -1 });
      }
      else if (q.location) {
        folders = await FolderModel.find({
          $and: [
            {
              $expr: {
                $eq: [{ $last: '$location' }, q.location],
              },
            },
            { userId: req.user.id },
            { trashed: { $eq: q.trashed ?? false } },
          ],
        }).sort({ createdAt: -1 });
      }
      else {
        folders = await FolderModel.find({
          $and: [
            { userId: req.user.id },
            { trashed: { $eq: q.trashed ?? false } },
          ],
        }).sort({ createdAt: -1 });
      }
    } else {
      folders = await FolderModel.find({
        userId: req.user.id,
      }).sort({ createdAt: -1 });
    }

    response({
      res,
      message: 'Request received by server',
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

exports.delete = async (req, res) => {
  try {
    const query = {
      $or: [
        {
          $and: [
            { userId: req.user.id },
            { _id: { $in: req.body } },
          ],
        },
        {
          parents: {
            $elemMatch: { $in: req.body },
          },
        },
      ],
    };

    const docs = await DocModel.find(query);

    await DocModel.deleteMany(query);
    await FolderModel.deleteMany(query);

    const root = nodepath.resolve(__dirname, `../../../uploads/${req.user.id}`);

    let i = 0;
    while (i < docs.length) {
      const src = `${root}/${docs[i].filename}.${docs[i].format}`;
      if (fs.existsSync(src)) fs.unlinkSync(src);
      i += 1;
    }

    response({
      res,
      message: 'Successfully deleted the folder and its contents',
      payload: {
        folders: req.body.length - docs.length,
        files: docs.length,
      },
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
