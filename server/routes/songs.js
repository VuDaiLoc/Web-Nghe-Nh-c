var express = require('express');
var router = express.Router();
var { getAllSongs, searchSongs, getSongById } = require('../controllers/songController');

// Lấy tất cả bài hát
// GET /api/songs
router.get('/', getAllSongs);

// Tìm kiếm bài hát
// GET /api/songs/search?q=keyword
router.get('/search', searchSongs);

// Lấy bài hát theo ID
// GET /api/songs/:id
router.get('/:id', getSongById);

module.exports = router;
