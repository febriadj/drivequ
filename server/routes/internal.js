const router = require('express').Router();
const document = require('../controllers/internal/document');
const folder = require('../controllers/internal/folder');

router.get('/documents', document.find);
router.get('/documents/file/:filename', document.open);
router.post('/documents', document.insert);

router.get('/folders', folder.find);
router.post('/folders', folder.insert);

module.exports = router;
