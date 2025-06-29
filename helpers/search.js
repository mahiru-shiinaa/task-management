  // Tìm kiểm
module.exports = (query) => {
    let objectSearch = {
        keyword: "",
        regex: ""
    }
  if(query.keyword) {
    objectSearch.keyword = query.keyword;
    // RegExp dùng để tìm kiếm không chính xác, không phân biệt chữ hoa chữ thường
    // Không cần gõ đúng title vẫn tìm đc thì dùng lệnh RegExp ở dưới
    const regex = new RegExp(query.keyword, "i");
    objectSearch.regex = regex;
  }
  return objectSearch;
};