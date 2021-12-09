const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    //User.findById(id, function(err, user) {
      done(null, user);
    //});
});

passport.use(new GoogleStrategy({
  },
  function(token, tokenSecret, profile, done) {
      //User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(null, profile);
      //});
  }
));
