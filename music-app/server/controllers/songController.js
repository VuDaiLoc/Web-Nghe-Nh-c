var SongService = require('../apps/Services/SongService');

// Lấy tất cả bài hát
// GET /api/songs
var getAllSongs = async function(req, res) {
    try {
        var songService = new SongService();
        var songs = await songService.getAllSongs();
        res.json({ success: true, data: songs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
};

// Tìm kiếm bài hát
// GET /api/songs/search?q=keyword
var searchSongs = async function(req, res) {
    try {
        var { q } = req.query;
        if (!q || q.trim() === '') {
            return res.json({ success: true, data: [] });
        }

        var songService = new SongService();
        var songs = await songService.searchSongs(q);
        res.json({ success: true, data: songs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi tìm kiếm: ' + error.message });
    }
};

// Lấy thông tin một bài hát theo ID
// GET /api/songs/:id
var getSongById = async function(req, res) {
    try {
        var songService = new SongService();
        var song = await songService.getSongById(req.params.id);
        if (!song) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bài hát' });
        }
        res.json({ success: true, data: song });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
};

module.exports = { getAllSongs, searchSongs, getSongById };
