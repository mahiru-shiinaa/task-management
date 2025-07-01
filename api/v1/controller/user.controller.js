const User = require("../models/user.model");
const ForgotPassword = require("../models/forgot-password.model");
const md5 = require("md5");
const generateHelper = require("../../../helpers/generate");
const sendMailHelper = require("../../../helpers/sendMail");
//[POST] /api/v1/users/register
module.exports.register = async (req, res) => {
  try {
    req.body.password = md5(req.body.password);
    const exitsEmail = await User.findOne({
      email: req.body.email,
      deleted: false,
    });
    if (exitsEmail) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    req.body.token = generateHelper.generateToken();
    const newUser = new User(req.body );
    await newUser.save();
    const token = newUser.token;
    res.cookie("token", token, { httpOnly: true });
    res.json({
      code: 200,
      message: "Đăng ký tài khoản thành công",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

//[POST] /api/v1/users/login
module.exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email, deleted: false });
    if (!user) {
      return res.status(400).json({ message: "Tài khoản không tồn tại" });
    }
    if (user.password !== md5(req.body.password)) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }
    const token = user.token;
    res.cookie("token", token, { httpOnly: true });
    res.json({ code: 200, message: "Login thành công", token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

//[POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = User.findOne({ email: email, deleted: false });
    if (!user) {
      return res.json({
        code: 400,
        message: "Email không tồn tại",
      });
    }

    // Việc 1: Tạo mã Otp và lưu thông tin OTP và Email yêu cầu vào collection
    const otp = generateHelper.generateRandomNumber();

    const objectForgotPassword = {
      email: email,
      otp: otp,
      expiresAt: Date.now(),
    };
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // Việc 2: Gửi mã OPT qua email của user
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    sendMailHelper.sendMail(email, subject, otp);
    res.json({
      code: 200,
      message: "Gửi mã OTP thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

//[POST] /api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;
    const result = await ForgotPassword.findOne({ email: email, otp: otp });
    if (!result) {
      return res.json({
        code: 400,
        message: "Sai mã OTP",
      });
    }
    const user = await User.findOne({ email: email, deleted: false });
    res.cookie("token", user.token, { httpOnly: true });
    res.json({
      code: 200,
      message: "Xác thực thành công",
      token: user.token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

//[POST] /api/v1/users/password/reset
module.exports.resetPassword = async (req, res) => {
  try {
    const token = req.body.token;
    const password = md5(req.body.password);
    const user = await User.findOne({ token: token, deleted: false });
    if(!user) {
      return res.json({
        code: 400,
        message: "Tài khoản không tồn tại",
      });
    }
    if(user.password === password) {
      return res.json({
        code: 400,
        message: "Vui lòng nhập mật khẩu khác mật khẩu cũ",
      });
    }
    user.password = password;
    await user.save();
    res.json({
      code: 200,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

//[GET] /api/v1/users/detail
module.exports.detail = async (req, res) => {
  try {
    const user = await User.findOne({ token: req.cookies.token, deleted: false }).select("-password -token");
    res.json({
      code: 200,
      message: "Thành công",
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};