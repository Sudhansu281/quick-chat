const router = require("express").Router();
const User = require("./../models/userModel");
const authMiddleware = require("./../middleware/authMiddleware");
// const message = require('../models/message');
// const cloudinary = require('./../cloudinary');
const user = require("./../models/userModel");

//GET Details of current logged-in user
router.get("/get-logged-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userId });
    console.log("✅ user from DB:", user);
    res.send({
      message: "user fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});

router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const userid = req.user.userId;
    const allUsers = await User.find({ _id: { $ne: userid } });

    res.send({
      message: "All users fetched successfully",
      success: true,
      data: allUsers,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});
module.exports = router;
