const router = require('express').Router();
const authenticate = require('../middleware/auth');

const user = require('../controllers/internal/user');
const trash = require('../controllers/internal/trash');
const document = require('../controllers/internal/document');
const folder = require('../controllers/internal/folder');

router.post('/register', user.register);
router.post('/login', user.login);
router.get('/user', authenticate, user.find);

router.post('/trash', authenticate, trash.insert);
router.get('/trash', authenticate, trash.find);
router.delete('/trash', authenticate, trash.delete);
router.put('/trash/recover', authenticate, trash.recover);

router.get('/documents', authenticate, document.find);
router.get('/documents/:id/file/:filename', document.open);
router.post('/documents', authenticate, document.insert);
router.put('/documents/trashing', authenticate, document.trashed);

router.get('/folders', authenticate, folder.find);
router.post('/folders', authenticate, folder.insert);

module.exports = router;
