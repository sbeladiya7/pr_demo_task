const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username must be provided"],
      trim: true,
    },
    fullname: {
      type: String,
      required: [true, "fullname must be provided"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email must be provided"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password must be provided."],
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const users = mongoose.model("users", usersSchema);
module.exports = users;
