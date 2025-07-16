const express = require('express');
const { loginController, registerController } = require('../Controller/userController');

const Router = express.Router();
console.log("✅ userRoutes loaded");
Router.post("/login",loginController);
Router.post("/signup",registerController);


module.exports = Router;
