const path = require('path');
const fs = require('fs');
const multer = require('multer');

const randomStr = require('../../helpers/randomStr');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const base = path.join(__dirname, '../../../uploads');

    if (!fs.existsSync(base)) fs.mkdirSync(base);
    cb(null, base);
  },
  filename(req, file, cb) {
    cb(null, randomStr());
  },
});

module.exports = multer({ storage });
