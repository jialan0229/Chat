const express = require('express');
const router = express.Router();
const { searchUsername, addFriend } = require('../../controller/friends/index');
const authenticateToken = require('../../utils/auth');

// router.get('/friend')
router.get('/search/user', authenticateToken, searchUsername)
router.post('/add/friend', authenticateToken, addFriend)

module.exports = router;