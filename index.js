const express = require("express");
const database = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;
require("dotenv").config();
const cors = require("cors"); 
database.connect();
// Middleware để đọc body từ client, không cần body-parser nâng cao
app.use(express.json()); // Đọc JSON từ client (axios/fetch gửi lên)
app.use(express.urlencoded({ extended: true })); // Nếu dùng form HTML gửi lên

app.use(cookieParser());

//  Cho phép CORS
app.use(cors()); // 👈 cấu hình mặc định: cho phép tất cả origin
const routesApiV1 = require("./api/v1/routes/index.route");
routesApiV1(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
