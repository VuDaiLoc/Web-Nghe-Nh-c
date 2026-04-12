var PlaylistService = require('../apps/Services/PlaylistService');

// Lấy tất cả playlist của user
var getPlaylists = async function(req, res) {
    try {
        var playlistService = new PlaylistService();
        var playlists = await playlistService.getPlaylistsByOwner(req.user._id);
        res.json({ success: true, data: playlists });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
};

// Tạo playlist mới
var createPlaylist = async function(req, res) {
    try {
        var { name } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).json({ success: false, message: 'Tên playlist không được để trống' });
        }

        var playlistService = new PlaylistService();
        var playlist = await playlistService.createPlaylist(name, req.user._id);
        res.status(201).json({ success: true, data: playlist, message: 'Tạo playlist thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
};

// Xóa playlist
var deletePlaylist = async function(req, res) {
    try {
        var playlistService = new PlaylistService();
        var result = await playlistService.deletePlaylist(req.params.id, req.user._id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy playlist hoặc bạn không có quyền xóa' });
        }
        res.json({ success: true, message: 'Đã xóa playlist' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
};

// Thêm bài hát vào playlist
var addSongToPlaylist = async function(req, res) {
    try {
        var { songId } = req.body;
        var playlistService = new PlaylistService();
        var playlist = await playlistService.addSongToPlaylist(req.params.id, req.user._id, songId);
        res.json({ success: true, data: playlist, message: 'Đã thêm bài hát vào playlist' });
    } catch (error) {
        var status = error.message === "Playlist not found" ? 404 : 500;
        res.status(status).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
};

// Xóa bài hát khỏi playlist
var removeSongFromPlaylist = async function(req, res) {
    try {
        var playlistService = new PlaylistService();
        await playlistService.removeSongFromPlaylist(req.params.id, req.user._id, req.params.songId);
        res.json({ success: true, message: 'Đã xóa bài hát khỏi playlist' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
};

module.exports = { getPlaylists, createPlaylist, deletePlaylist, addSongToPlaylist, removeSongFromPlaylist };
