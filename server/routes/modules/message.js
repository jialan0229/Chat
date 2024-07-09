const express = require('express');
const router = express.Router();

const { getList, getChatList, updateStatus } = require('../../controller/message/index');
const authenticateToken = require('../../utils/auth');

router.get('/friend/list', authenticateToken, getList);
router.post('/update/status', authenticateToken, updateStatus);
router.ws('/chat/list', getChatList);

module.exports = router;