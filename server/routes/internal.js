const router = require('express').Router();
const authenticate = require('../middleware/internal/auth');

const user = require('../controllers/internal/user');
const trash = require('../controllers/internal/trash');
const document = require('../controllers/internal/document');
const folder = require('../controllers/internal/folder');
const zip = require('../controllers/internal/zip');

router.post('/register', user.register);
router.post('/login', user.login);
router.get('/user', authenticate, user.find);
router.put('/user/accessKeyId', authenticate, user.updateAccessKeyId);

router.post('/trash', authenticate, trash.insert);
router.get('/trash', authenticate, trash.find);
router.delete('/trash', authenticate, trash.delete);
router.put('/trash/recover', authenticate, trash.recover);

router.get('/documents', authenticate, document.find);
router.get('/documents/:id/file/:filename', document.open);
router.get('/documents/size', authenticate, document.size);
router.post('/documents', authenticate, document.insert);
router.put('/documents/move', authenticate, document.move);
router.put('/documents/trashing', authenticate, document.trashed);

router.get('/folders', authenticate, folder.find);
router.post('/folders', authenticate, folder.insert);

router.post('/zip', authenticate, zip.create);
router.delete('/zip/delete', authenticate, zip.delete);

module.exports = router;
