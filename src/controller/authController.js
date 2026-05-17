const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const verificationToken = require("../model/verificationToken");
const emptyFieldValidation = require("../utils/validation");
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

    // Create verification token
    const token = uuidv4();
    await new verificationToken({
      userId: user._id,
      token,
    }).save();
    // send email
    // nodemail
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const verificationUrl = `${process.env.APP_URL}/api/v1/auth/verify-email?token=${token}&email=${user.email}`;
    const mailOption = {
      from: `"Daraz Shop,<${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verify your email --Daraz Shop ",
      html: `<body style=margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif><table cellpadding=0 cellspacing=0 style="padding:40px 0;background:#f4f4f4"width=100%><tr><td align=center><table cellpadding=0 cellspacing=0 style="background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 0 10px rgba(0,0,0,.1)"width=600><tr><td align=center style=background:#f85606;padding:30px;color:#fff><h1 style=margin:0;font-size:32px>Daraz Shop</h1><p style=margin-top:10px;font-size:16px>Verify Your Email Address<tr><td style="padding:40px 30px;color:#333"><h2 style=margin-top:0>Hello User 👋</h2><p style=font-size:16px;line-height:26px>Thank you for registering at <strong>Daraz Shop</strong>. Please verify your email address to activate your account.<div style="text-align:center;margin:40px 0"><a href="${verificationUrl}" style="background:#f85606;color:#fff;text-decoration:none;padding:15px 35px;border-radius:5px;font-size:16px;display:inline-block;font-weight:700">Verify Account</a></div><p style=font-size:15px;line-height:24px>If you did not create this account, you can safely ignore this email.<p style=margin-top:40px>Regards,<br><strong>Daraz Shop Team</strong><tr><td align=center style=background:#f1f1f1;padding:20px;color:#777;font-size:13px>© 2026 Daraz Shop. All rights reserved.</table></table>`,
    };
    try {
      await transporter.sendMail(mailOption);
      console.log("email send");
    } catch (error) {
      console.error(`email send error:`, error);
    }
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
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    emptyFieldValidation(res, email, password);
    // finds user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credendial",
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credendial",
      });
    }
    // Genaret token
    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
    );
    const refreshToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
    );
    // save refresh token to user
    user.refreshTokens.push({
      token: refreshToken,
      createdAt: new Date(),
      // expiresAt: new Date(Date.now() + 7*24*60*60*1000) optional,
    });
    await user.save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 100,
      path: "/",
    });
    res.status(200).json({
      success: true,
      message: "Login Successful ",
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.log(error, "Login errro");
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
