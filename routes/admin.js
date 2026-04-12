var express = require('express');
var router = express.Router();
var { isAdmin } = require('../middleware/adminMiddleware');
var { uploadSongFiles } = require('../config/multer');
var {
    getAllUsersAdmin,
    updateUserRoleAdmin,
    deleteUserAdmin,
    createSongAdmin,
    updateSongAdmin,
    deleteSongAdmin
} = require('../controllers/adminController');

// All endpoints inside this file are protected by isAdmin
router.use(isAdmin);

router.get('/users', getAllUsersAdmin);
router.put('/users/:id/role', updateUserRoleAdmin);
router.delete('/users/:id', deleteUserAdmin);

// Song routes with file upload middleware
router.post('/songs', uploadSongFiles, createSongAdmin);
router.put('/songs/:id', uploadSongFiles, updateSongAdmin);
router.delete('/songs/:id', deleteSongAdmin);

module.exports = router;
