const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, minlength: 2, maxlength: 30, required: true },
  email: {
    type: String,
    minlength: 5,
    maxlength: 300,
    unique: true,
    required: true,
  },
  password: { type: String, minlength: 4, maxlength: 1024, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
