var express = require('express');
var passport = require('passport');
var router = express.Router();
var { facebookCallback, logout, getMe, registerLocal } = require('../controllers/authController');
var UserService = require('../apps/Services/UserService');

// ============================
// ĐĂNG NHẬP / ĐĂNG KÝ LOCAL
// ============================

// POST /auth/register
router.post('/register', registerLocal);

// POST /auth/login
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return res.status(500).json({ success: false, message: 'Lỗi server' }); }
    if (!user) { return res.status(401).json({ success: false, message: info.message || 'Sai thông tin đăng nhập' }); }
    
    req.logIn(user, function(err) {
      if (err) { return res.status(500).json({ success: false, message: 'Lỗi session' }); }
      return res.status(200).json({
        success: true,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role
        }
      });
    });
  })(req, res, next);
});

// ============================
// ĐĂNG NHẬP FACEBOOK
// ============================

// Bắt đầu đăng nhập Facebook
// GET /auth/facebook
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}));

// Callback sau khi Facebook xác thực xong
// GET /auth/facebook/callback
router.get('/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=true`
  }),
  facebookCallback
);

// Đăng xuất
// GET /auth/logout
router.get('/logout', logout);

// Lấy thông tin user hiện tại
// GET /auth/me
router.get('/me', getMe);



module.exports = router;
