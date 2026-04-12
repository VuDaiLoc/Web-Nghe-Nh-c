// authMiddleware.js - Middleware kiểm tra xác thực (alias của auth.js)
// Tách thành file riêng để đúng cấu trúc commit theo kế hoạch

// Kiểm tra người dùng đã đăng nhập chưa
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: 'Vui lòng đăng nhập để tiếp tục'
  });
};

// Kiểm tra user có phải admin không (dự phòng mở rộng sau)
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền thực hiện thao tác này'
  });
};

module.exports = { isAuthenticated, isAdmin };
