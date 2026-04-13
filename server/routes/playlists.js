var express = require('express');
var router = express.Router();
var {
  getPlaylists,
  createPlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist
} = require('../controllers/playlistController');
var { isAuthenticated } = require('../middleware/authMiddleware');

// Lấy tất cả playlist - GET /api/playlists
router.get('/', isAuthenticated, getPlaylists);

// Tạo playlist mới - POST /api/playlists
router.post('/', isAuthenticated, createPlaylist);

// Xóa playlist - DELETE /api/playlists/:id
router.delete('/:id', isAuthenticated, deletePlaylist);

// Thêm bài hát vào playlist - POST /api/playlists/:id/songs
router.post('/:id/songs', isAuthenticated, addSongToPlaylist);

// Xóa bài hát khỏi playlist - DELETE /api/playlists/:id/songs/:songId
router.delete('/:id/songs/:songId', isAuthenticated, removeSongFromPlaylist);

module.exports = router;
