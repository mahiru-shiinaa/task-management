const express = require("express");
const router = express.Router();

const Task = require("../../../models/task.model");

router.get("/", async (req, res) => {
  const tasks = await Task.find({ deleted: false });

  res.json(tasks);
});
router.get(`/detail/:id`, async (req, res) => {
  try {
    const tasks = await Task.findOne({ deleted: false, _id: req.params.id });
    res.json(tasks);
  } catch (error) {
    res.json("Không tìm thấy data");
  }
});

module.exports = router;
