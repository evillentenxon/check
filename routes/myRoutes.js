const express = require('express');
const router = express.Router();
const postController = require('../controllers/myControllers');

router.post('/sent', postController.postData);
router.post('/sentOtp',postController.otpSend);
router.post('/verifyOtp',postController.otpVerify);

module.exports = router;