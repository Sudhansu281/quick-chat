const generateToken = require("../Config/generateToken");
const UserModel = require("../models/userModel");
const expressAsyncHandler = require("express-async-handler");
// Login
const loginController = expressAsyncHandler(async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  console.log("fetched user Data", user);
  console.log(await user.matchPassword(password));
  if (user && (await user.matchPassword(password))) {
    res.send({
      success: true,
      message: "User loggedin successfully",
      user:{
      _id: user._id,
      name: user.username,
      email: user.email,
      // isAdmin: user.isAdmin,
      token: generateToken(user._id),
      },
    });
  } else {
    res.send({message:"Invalid email or password"});
    // throw new Error("Invalid email or Password");
  }
  console.log("Generated token:", generateToken(user._id));
});

// Registration
const registerController = expressAsyncHandler(async (req, res) => {
  console.log("✅ registerController hit");
  const { username, email, password } = req.body;

  // check for all fields
  if (!username || !email || !password) {
    res.send({message:"All necessary input fields have not been filled"});
    // throw Error("All necessary input fields have not been filled");
  }

  // pre-existing user
  const userExist = await UserModel.findOne({ email });
  if (userExist) {
    res.send({message:"User already exist"});
    // throw new Error("User already Exists");
  }

  // userName already Taken
  const userNameExist = await UserModel.findOne({ username });
  if (userNameExist) {
    res.send({meaasge:"Username already taken"});
    // throw new Error("UserName already taken");
  }

  // create an entry in the db
  const user = await UserModel.create({ username, email, password });
  if (user) {
    res.send({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.username,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400);
    throw new Error("Registration Error");
  }
});

module.exports = {
  loginController,
  registerController,
};
