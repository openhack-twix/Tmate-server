const express = require("express");
const session = require("express-session");
const {ensureAuthenticated} = require('../auth/index');
var passport = require("passport"),
  FacebookStrategy = require("passport-facebook").Strategy;

module.exports = exports = function(app) {
  app.use(
    session({
      secret: "12345",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new FacebookStrategy(
      {
        clientID: "405189250337659",
        clientSecret: "bb77ade54c73fba79c1e3b556a5fa993",
        callbackURL: "http://localhost:3000/auth/facebook/callback"
      },

      function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        done(null, profile);
      }
    )
  );

  passport.serializeUser(function(user, done) {
    console.log("user:", user);
    return done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    //findById(id, function (err, user) {

    console.log("deserialize, user:", user);

    done(null, user);
    //req.user 에 저장됨

    //});
  });

  const router = express.Router();

  router.get("/auth/facebook", passport.authenticate("facebook"));

  router.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: "/login_success",
      failureRedirect: "/login_fail"
    })
  );

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');

});

  router.get("/login_success", ensureAuthenticated, function(req, res) {
    res.send(req.user);
  });

  router.get("/login_fail", ensureAuthenticated, function(req, res) {
    res.send("<h1>FAIL</h1>");
  });

  router.get("/success", (req, res) => {
    res.send(req.user);
  });

  router.get("/failure", (req, res) => {
    res.send("<h1>FAILURE</h1>");
  });

  app.use(router);
};
