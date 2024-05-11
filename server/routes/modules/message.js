const express = require('express');
const router = express.Router();

const { getList, getChatList } = require('../../controller/message/index');

router.get('/friend/list', getList);
router.ws('/chat/list', getChatList);

module.exports = router;