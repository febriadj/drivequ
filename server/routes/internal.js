const router = require('express').Router();
const document = require('../controllers/internal/document');

router.post('/documents', document.insert);
router.get('/documents', document.find);

module.exports = router;
