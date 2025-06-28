const express = require("express");
const database = require("./config/database");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();
database.connect();
const Task = require("./models/task.model");

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find({ deleted: false });

  res.json(tasks);
});
app.get(`/tasks/detail/:id`, async (req, res) => {
  try {
    const tasks = await Task.findOne({ deleted: false, _id: req.params.id });
    res.json(tasks);
  } catch (error) {
    res.json("Không tìm thấy data");
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
