const User = require("../models/user.model");
const md5 = require("md5");
//[POST] /api/v1/users/register
module.exports.register = async (req, res) => {
    try {
        req.body.password = md5(req.body.password);
        const exitsEmail = await User.findOne({ email: req.body.email, deleted: false });
        if (exitsEmail) {
            return res.status(400).json({ message: "Email đã tồn tại" });
        }
        const newUser = new User(req.body);
        await newUser.save();
        const token = newUser.token;
        res.cookie("token", token, { httpOnly: true });
        res.json( {
            code: 200,
            message: "Đăng ký tài khoản thành công",
            token: token
            
        })
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