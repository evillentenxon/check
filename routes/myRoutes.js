const express = require('express');
const router = express.Router();
const postController = require('../controllers/myControllers');

router.post('/sent', postController.postData);

module.exports = router;