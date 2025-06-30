
const mongoose = require("mongoose");
// Tạo khung dữ liệu
const forgotPasswordSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expiresAt: {
        type: Date,
        expires: 380
    },

    

}, {
    // Dùng để thêm thời gian tạo và cập nhật sản phẩm tự động
    timestamps: true
});

// Tạo model                  Tên model   Tên khung dữ liệu   Tên collection
const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema, "forgot-password");

module.exports = ForgotPassword;