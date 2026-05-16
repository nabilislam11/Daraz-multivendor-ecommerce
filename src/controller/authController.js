const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
exports.registration = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name,Email and Password are requiresd",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User is exis",
      });
    }
    const user = new User({
      name: name,
      email: email,
      phone: phone || undefined,
      role: role || "Customer",
    });
    await user.save();
    res.status(201).json({
      success: true,
      message: "Successfully Registraiton Done",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error during Registraiton ",
    });
  }
};
