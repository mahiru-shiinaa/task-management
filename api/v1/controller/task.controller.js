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
