const mongoose = require("mongoose");
const generate = require("../../../helpers/generate");

// Tạo khung dữ liệu
const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    statusOnline: String,
    token: String,
    phone: String,
    avatar: String,
    // Kiểu là boolean, nếu mà tạo mới thì để kiểu mặc định là false
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    // Dùng để thêm thời gian tạo và cập nhật sản phẩm tự động
    timestamps: true,
  }
);

// Tạo model                  Tên model   Tên khung dữ liệu   Tên collection
const User = mongoose.model("User", userSchema, "users");

module.exports = User;
