const { Router } = require("express");
const { UserModel } = require("../models/userModel");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const userRouter = Router();
require("dotenv").config();
const secret = process.env.secretKey;
/// Register User
userRouter.post("/register", async (req, res) => {
  try {
    const { email, password, gender, name } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(400).send({
        msg: "User with this email already exist, Please proceed to login",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 5);
    const newuser = await UserModel.create({
      name,
      email,
      gender,
      password: hashedPassword,
    });
    res.status(201).send({
      msg: "User registered",
      user: newuser,
    });
  } catch (error) {
    res.status(500).send({
      msg: "Something went wrong while registering user",
      error: error.message,
    });
  }
});

/// Login User
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(400).send({
        msg: "User not found",
      });
      return;
    }
    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) {
      res.status(400).send({
        msg: "Wrong credentials",
      });

      return;
    }

    const token = jwt.sign(
      {
        username: user.name,
        userId: user._id,
      },
      secret,
      { expiresIn: "3h" }
    );

    res.status(201).send({
      msg: "User Logged in successfully",
      token,
      LoggedIn: user,
    });
  } catch (error) {
    res.status(500).send({
      msg: "Something went wrong while logging in user",
      error: error.message,
    });
  }
});
module.exports = { userRouter };
