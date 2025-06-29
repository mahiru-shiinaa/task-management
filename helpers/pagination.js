module.exports = (objectPagination, query, countRecords) => {
      if(query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }
      if(query.limit) {
    objectPagination.limitItem = parseInt(query.limit);
  }
  // Dùng để tính số sản phẩm skip qua khi nhấn phân trang
  objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem;

  // Tính tổng số trang và tìm ra bao nhiêu pagination cùng với làm tròn số trang

  objectPagination.totalPage = Math.ceil(countRecords / objectPagination.limitItem);

  return objectPagination;
}