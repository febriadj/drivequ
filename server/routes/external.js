const router = require('express').Router();
const authenticate = require('../middleware/external/auth');

// const trash = require('../controllers/internal/trash');
const document = require('../controllers/external/document');
const folder = require('../controllers/external/folder');

// router.post('/trash', trash.insert);
// router.get('/trash', trash.find);
// router.delete('/trash', trash.clear);

router.get('/documents', authenticate, document.find);
router.get('/documents/file/:filename', document.open);
router.post('/documents', authenticate, document.insert);
router.put('/documents/trashing', authenticate, document.trashing);
router.delete('/documents', authenticate, document.delete);

router.get('/folders', authenticate, folder.find);
router.post('/folders', authenticate, folder.insert);

module.exports = router;
