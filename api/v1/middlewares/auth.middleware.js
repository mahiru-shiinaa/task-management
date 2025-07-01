const User = require("../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ Code: 400, message: "Vui lòng gửi kèm token" });
    }

    const token = authHeader.split(" ")[1];
    console.log("token", token);

    const user = await User.findOne({ token: token, deleted: false }).select(
      "-password"
    ); 

    if (!user) {
      return res
        .status(401)
        .json({ Code: 400, message: "Tài khoản không hợp lệ" });
    }

    // Gắn user vào req để các middleware sau dùng
    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
