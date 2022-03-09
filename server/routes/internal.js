const router = require('express').Router();

const trash = require('../controllers/internal/trash');
const document = require('../controllers/internal/document');
const folder = require('../controllers/internal/folder');

router.post('/trash', trash.insert);
router.get('/trash', trash.find);
router.delete('/trash', trash.clear);

router.get('/documents', document.find);
router.get('/documents/file/:filename', document.open);
router.post('/documents', document.insert);
router.delete('/documents/trash', document.trashed);

router.get('/folders', folder.find);
router.post('/folders', folder.insert);

module.exports = router;
