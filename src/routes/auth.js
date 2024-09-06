const express = require('express');
const router = express.Router();
const { login, getMe, authorRegister } = require('../controllers/auth');

router.post('/login', login);
router.post('/author/register', authorRegister);
router.get('/me', getMe);

module.exports = router;
