var isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập !' });
};

module.exports = { isAdmin };
