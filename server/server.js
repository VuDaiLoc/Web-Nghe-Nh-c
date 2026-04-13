var path = require('path');
global.__basedir = __dirname;
require('dotenv').config();

var express = require('express');
var cors = require('cors');
var session = require('express-session');
var MongoStore = require('connect-mongo');
var passport = require('passport');

var app = express();

// Set up MongoDB Connection String for Session Store
var config = require(global.__basedir + "/Config/Setting.json");
var mongoUrl = "mongodb://127.0.0.1:27017/" + config.mongodb.database + "?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000";

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Config (sử dụng MongoDB session store)
app.use(session({
  secret: process.env.SESSION_SECRET || 'paracy_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoUrl,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Initialize Passport
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Serve static uploaded files (audio, images)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api/songs', require('./routes/songs'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/playlists', require('./routes/playlists'));
app.use('/api/admin', require('./routes/admin'));

// Global error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Đã xảy ra lỗi hệ thống!' });
});

var PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
  console.log('Server is running on port ' + PORT);
});
