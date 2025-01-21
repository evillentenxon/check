const express = require("express");
const router = express.Router();

const { usersList,
    delUser,
    userUpdate,
 } = require("../controllers/userController");

router.get('/allUsers', usersList);
router.delete("/deleteUser/:id", delUser);
router.put("/updateUser/:id", userUpdate);

module.exports = router;