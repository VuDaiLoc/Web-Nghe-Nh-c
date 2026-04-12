var multer = require('multer');
var path = require('path');
var fs = require('fs');

// Đảm bảo thư mục tồn tại
var audioDir = path.join(global.__basedir, 'public/uploads/audio');
var imageDir = path.join(global.__basedir, 'public/uploads/images');
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });
if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });

// Cấu hình nơi lưu file và tên file
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if (file.fieldname === 'audioFile') {
            cb(null, audioDir);
        } else if (file.fieldname === 'imageFile') {
            cb(null, imageDir);
        } else {
            cb(new Error('Trường file không hợp lệ'), null);
        }
    },
    filename: function(req, file, cb) {
        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        var ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// Kiểm tra loại file
var fileFilter = function(req, file, cb) {
    if (file.fieldname === 'audioFile') {
        if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/mp3' || file.mimetype === 'audio/wav' || file.mimetype === 'audio/ogg') {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file âm thanh (mp3, wav, ogg)'), false);
        }
    } else if (file.fieldname === 'imageFile') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file hình ảnh'), false);
        }
    } else {
        cb(null, true);
    }
};

var upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // Giới hạn 50MB
});

// Middleware upload cả audio và image cùng lúc
var uploadSongFiles = upload.fields([
    { name: 'audioFile', maxCount: 1 },
    { name: 'imageFile', maxCount: 1 }
]);

module.exports = { uploadSongFiles };
