const express = require('express');
const router = express.Router();
const { searchUser } = require('../../controller/friends/index');
const authenticateToken = require('../../utils/auth');

// router.get('/friend')
router.get('/search/user', authenticateToken, searchUser)

module.exports = router;