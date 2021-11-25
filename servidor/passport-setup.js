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
    //consumerKey:"1033113634921-r4dmuu6c5l1ujv69nsgb68486sstasal.apps.googleusercontent.com",
    clientID : "1033113634921-r4dmuu6c5l1ujv69nsgb68486sstasal.apps.googleusercontent.com",
    //consumerSecret: "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",
    clientSecret : "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",
    callbackURL: "http://localhost:5000/google/callback"
  },
  function(token, tokenSecret, profile, done) {
      //User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(null, profile);
      //});
  }
));