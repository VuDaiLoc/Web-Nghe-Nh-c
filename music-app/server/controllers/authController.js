var passport = require('passport');
var UserService = require('../apps/Services/UserService');

// Bắt đầu quá trình đăng nhập Facebook
// GET /auth/facebook
var loginFacebook = passport.authenticate('facebook', {
    scope: ['public_profile']
});

// Xử lý callback từ Facebook sau khi xác thực
// GET /auth/facebook/callback
var facebookCallback = function(req, res) {
    // Đăng nhập thành công → redirect về client
    res.redirect(process.env.CLIENT_URL);
};

// Xử lý đăng xuất
// GET /auth/logout
var logout = function(req, res) {
    req.logout(function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Lỗi đăng xuất' });
        }
        req.session.destroy();
        res.redirect(process.env.CLIENT_URL);
    });
};

// Lấy thông tin user đang đăng nhập từ session
// GET /auth/me
var getMe = function(req, res) {
    if (req.isAuthenticated()) {
        return res.json({
            success: true,
            user: {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                avatar: req.user.avatar,
                role: req.user.role
            }
        });
    }
    return res.json({ success: false, user: null });
};

// Đăng ký local
var registerLocal = async function(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        var userService = new UserService();
        var user = await userService.registerLocalUser(name, email, password);
        
        // Đăng nhập luôn sau khi đăng ký
        req.login(user, function(err) {
            if (err) { return res.status(500).json({ success: false, message: 'Lỗi session đăng nhập' }); }
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
    } catch (error) {
        if (error.message === 'Email already exists') {
            return res.status(400).json({ success: false, message: 'Email này đã được sử dụng' });
        }
        return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

module.exports = { loginFacebook, facebookCallback, logout, getMe, registerLocal };
