const path = require('path');
const fs = require('fs');
const multer = require('multer');
const randomStr = require('../../helpers/randomStr');
const config = require('../../config');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const base = path.join(__dirname, '../../../uploads');
    const dest = `${base}/${req.user.id}`;

    if (!fs.existsSync(base)) fs.mkdirSync(base);
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);

    cb(null, dest);
  },
  filename(req, file, cb) {
    const filename = randomStr();
    const ext = path.extname(file.originalname);

    file.newFilename = filename;
    file.format = ext.slice(1, ext.length);
    file.url = `/api/documents/${req.user.id}/file/${filename}${ext}`;

    cb(null, `${filename}${ext}`);
  },
});

module.exports = multer({
  storage,
  limits: {
    fileSize: config.fileUpload.max,
  },
  fileFilter(req, file, cb) {
    const allowed = config.fileUpload.types;
    const valid = allowed.includes(file.mimetype.split('/')[0]);

    if (!valid) {
      cb({ message: 'File type not allowed' });
      return;
    }

    cb(null, true);
  },
});
