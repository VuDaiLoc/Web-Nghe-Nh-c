var UserService = require('../apps/Services/UserService');
var SongService = require('../apps/Services/SongService');

// Quản lý người dùng
const getAllUsersAdmin = async (req, res) => {
    try {
        var service = new UserService();
        var users = await service.getAllUsers();
        res.json({ success: true, data: users });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

const updateUserRoleAdmin = async (req, res) => {
    try {
        var { id } = req.params;
        var { role } = req.body;
        // prevent self-demoting by error if needed, but we'll trust the user here
        var service = new UserService();
        await service.updateUserRole(id, role);
        res.json({ success: true, message: "Cập nhật quyền thành công." });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

const deleteUserAdmin = async (req, res) => {
    try {
        var { id } = req.params;
        var service = new UserService();
        await service.deleteUser(id);
        res.json({ success: true, message: "Đã xóa người dùng." });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

// Quản lý Mucsic
const createSongAdmin = async (req, res) => {
    try {
        var songData = req.body;
        var service = new SongService();
        var song = await service.createSong(songData);
        res.json({ success: true, data: song });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

const updateSongAdmin = async (req, res) => {
    try {
        var { id } = req.params;
        var updateData = req.body;
        var service = new SongService();
        await service.updateSong(id, updateData);
        res.json({ success: true, message: "Cập nhật bài hát thành công." });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

const deleteSongAdmin = async (req, res) => {
    try {
        var { id } = req.params;
        var service = new SongService();
        await service.deleteSong(id);
        res.json({ success: true, message: "Đã xóa bài hát." });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

module.exports = {
    getAllUsersAdmin,
    updateUserRoleAdmin,
    deleteUserAdmin,
    createSongAdmin,
    updateSongAdmin,
    deleteSongAdmin
};
