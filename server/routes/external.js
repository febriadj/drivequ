const router = require('express').Router();
const authenticate = require('../middleware/external/auth');

const document = require('../controllers/external/document');
const folder = require('../controllers/external/folder');

router.get('/documents', authenticate, document.find);
router.get('/documents/:id/file/:filename', document.open);
router.post('/documents', authenticate, document.insert);
router.delete('/documents', authenticate, document.delete);

router.get('/folders', authenticate, folder.find);
router.post('/folders', authenticate, folder.insert);
router.delete('/folders', authenticate, folder.delete);

module.exports = router;
