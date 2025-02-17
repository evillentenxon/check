const express = require("express");
const router = express.Router();
const upload = require('../config/multerConfig'); 

const { usersList,
    delUser,
    userUpdate,
 } = require("../controllers/userController");

router.get('/allUsers', usersList);
router.delete("/deleteUser/:id", delUser);
router.put("/updateUser/:id",upload.single('photo'),userUpdate);

module.exports = router;