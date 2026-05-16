const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required "],
      trim: true,
      minLength: 2,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
      required: [true, "Password is required "],
      minLength: 8,
    },
    phone: {
      type: true,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["Admin", "vendor", "customer"],
      default: "customer",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: [
      {
        token: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);
// password hash
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
module.exports = mongoose.model("User", userSchema);
