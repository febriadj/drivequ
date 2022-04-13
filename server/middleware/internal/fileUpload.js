const path = require('path');
const multer = require('multer');

const randomStr = require('../../helpers/randomStr');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../../../uploads'));
  },
  filename(req, file, cb) {
    cb(null, randomStr());
  },
});

module.exports = multer({ storage });
