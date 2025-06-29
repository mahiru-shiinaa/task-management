const Task = require("../models/task.model");
const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");

//[GET] /api/v1/tasks
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }
  //sort
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }
  countTask = await Task.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      limitItem: 2,
      currentPage: 1,
    },
    req.query,
    countTask
  );
  //end sort

  //search 
  // Tìm kiếm
  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  //end search
  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);
  res.json(tasks);
};

//[GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const tasks = await Task.findOne({ deleted: false, _id: req.params.id });
    res.json(tasks);
  } catch (error) {
    res.json("Không tìm thành data");
  }
};

//[PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Trả về bản ghi sau khi cập nhật chỉ dùng với findByIdAndUpdate
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Không tìm thấy task" });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

//[PATCH]  /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const {ids, key, value} = req.body;
    switch (key) {
        case "status":
            const updatedTasks = await Task.updateMany({ _id: { $in: ids } }, { status: value });
            res.json(updatedTasks);
            break;
        case "delete":
            const deletedTasks = await Task.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date() });
            res.json("Xóa thành công!");
            break;
        default:
            res.status(404).json({ message: "Không tìm thấy task" });
            break;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

//[POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
     
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
    
}
};

//[PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
    
}
};

//[DELETE] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
try {
    const id = req.params.id;
    await Task.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
    res.json({ message: "Xóa task thanh cong" });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
    
}
};
