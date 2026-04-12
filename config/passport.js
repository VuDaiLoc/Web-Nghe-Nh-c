var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var UserService = require('../apps/Services/UserService');

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function(id, done) {
  try {
    var userService = new UserService();
    var user = await userService.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'picture.type(large)']
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      var userService = new UserService();
      var user = await userService.findOrCreateFacebookUser(profile);
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async function(email, password, done) {
    try {
      var userService = new UserService();
      var user = await userService.verifyLocalUser(email, password);
      if (!user) {
        return done(null, false, { message: 'Email hoặc mật khẩu không chính xác' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

module.exports = passport;
