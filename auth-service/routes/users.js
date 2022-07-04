const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
// const { verifyJWT } = require('../middleware/auth');

router.post('/register', users.register);

router.post('/login', users.login);

router.get('/profile', users.profile);

module.exports = router;
