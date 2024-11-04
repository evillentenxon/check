const express = require('express');
const router = express.Router();
const postController = require('../controllers/myControllers');
const upload = require('../controllers/multerConfig'); // Adjust path as needed

router.post('/sent', upload.single('photo'), postController.postData);
router.post('/sentOtp',postController.otpSend);
router.post('/verifyOtp',postController.otpVerify);
router.post('/login',postController.login);

module.exports = router;