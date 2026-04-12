var UserService = require('../apps/Services/UserService');

// Lấy danh sách yêu thích
var getFavorites = async function(req, res) {
    try {
        var userService = new UserService();
        var favorites = await userService.getFavorites(req.user._id);
        res.json({ success: true, data: favorites });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
};

// Thêm vào yêu thích
var addFavorite = async function(req, res) {
    try {
        var { songId } = req.params;
        var userService = new UserService();
        await userService.addFavorite(req.user._id, songId);
        res.json({ success: true, message: 'Đã thêm vào yêu thích' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
};

// Xóa khỏi yêu thích
var removeFavorite = async function(req, res) {
    try {
        var { songId } = req.params;
        var userService = new UserService();
        await userService.removeFavorite(req.user._id, songId);
        res.json({ success: true, message: 'Đã xóa khỏi yêu thích' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
};

module.exports = { getFavorites, addFavorite, removeFavorite };
