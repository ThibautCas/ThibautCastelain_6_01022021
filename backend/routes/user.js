const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const bouncer = require ("express-bouncer")(500, 900000);       // Against brute-force attacks
const verifyPassword = require('../middleware/verify-password');// Checks password is complex enough  

router.post('/signup', verifyPassword, userCtrl.signup);
router.post('/login', bouncer.block, userCtrl.login);

module.exports = router;