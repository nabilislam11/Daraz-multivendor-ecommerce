const verificationToken = require("../model/verificationToken");
const User = require("../model/userSchema");
exports.verifyEmail = async (req, res) => {
  const { token, email } = req.query;
  try {
    const verificationToken = await verificationToken.findOne({ token });
    if (!verificationToken) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
      const user = await User.findById(verificationToken.userId);
      if (!User || User.email !== email) {
        return res.status(409).json({ message: "Invalid request" });
      }
      user.isEmailVerified = true;
      await user.save();
      await verificationToken.deleteOne({ _id: verificationToken._id });
      // frontend redirect.url
      res.redirect(`${process.env.FRONTEND_URL}/verify-success?email=${email}`);
    }
  } catch (error) {
    console.log(error, "Email verification error");

    res.status(500).json({
      message: "Server error ",
    });
  }
};
