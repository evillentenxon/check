const express = require('express');
const router = express.Router();
const postController = require('../controllers/myControllers');
const commController = require('../controllers/communityController');
const upload = require('../controllers/multerConfig');
const contactController = require('../controllers/contactController');

//authentication snga related
router.post('/sent', upload.single('photo'), postController.postData);
router.post('/sentOtp', postController.otpSend);
router.post('/verifyOtp', postController.otpVerify);
router.post('/login', postController.login);
router.post('/forgot_password',postController.requestPasswordReset);
router.patch('/reset-password',postController.passwordReset);

//community snga related
router.post('/communityCreate', upload.single('photo'), commController.communityCreate);
router.get('/topCommunities', commController.topCommunities);
router.get('/CommunityView/:communityId', commController.communityDetails);

//contact us (message) snga related
router.post('/contact', contactController.contact);//send messages
router.get('/messages', contactController.message);//fetch messages
router.delete('/delmsg/:id',contactController.delmsg); //delete messages

//3rd-party api 
router.get('/news',postController.news); // get latest news
router.get('/countries',postController.countries); //get all countries 

module.exports = router;