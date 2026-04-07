var express = require('express');
var router = express.Router();
var { getFavorites, addFavorite, removeFavorite } = require('../controllers/favoriteController');
var { isAuthenticated } = require('../middleware/authMiddleware');

// Lấy danh sách yêu thích - GET /api/favorites
router.get('/', isAuthenticated, getFavorites);

// Thêm yêu thích - POST /api/favorites/:songId
router.post('/:songId', isAuthenticated, addFavorite);

// Xóa yêu thích - DELETE /api/favorites/:songId
router.delete('/:songId', isAuthenticated, removeFavorite);

module.exports = router;
