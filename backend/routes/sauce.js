const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const sauceCtrl = require('../controllers/sauce');
const multer = require('../middleware/multer-config');

router.get('/', auth, multer, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;