const express = require("express");
const app = express();
const {User} = require('./models/user');

const mongoose = require('mongoose');

var passport = require("passport"),
  FacebookStrategy = require("passport-facebook").Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  console.log('deserialoze id:',id);
  const user = await User.findById(id);
  console.log(user);
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

const facebookKey = require("./config/facebook.json");

passport.use(
  new FacebookStrategy(facebookKey, async function(
    accessToken,
    refreshToken,
    profile,
    done
  ) {
    console.log(profile);
    const displayName = profile.displayName;
    
    let user = await User.findOne({ oauthId: profile.id });
    if (user) {
      console.log('YES!')
    } else {
      user = {
        email: 'abc@naver.com',
        name: profile.displayName,
        oauthId: profile.id
      };

      user = await new User(user).save();
      console.log("added:", user);
    }

    done(null, profile);
    // User.findOrCreate(..., function(err, user) {
    //   if (err) { return done(err); }
    //   done(null, user);
    // });
  })
);

app.get("/auth/facebook", passport.authenticate("facebook"));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

app.use(express.static("./"));
var isAuthenticated = function (req, res, next) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};
app.get('/api', isAuthenticated);
// app.use(require('./routes/login'));




// database 연결
const dbUrl = 'mongodb://localhost/tmate';
  // process.env.NODE_ENV === "production"
  //   ? config.get("database.url")
  //   : "mongodb://localhost/tmate";

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(() => console.log("🔥 Connected to mongodb!",`[${dbUrl}]`))
  .catch(err => console.log(`☠️ Failed to connect to mongodb: [${dbUrl}]`, err.message));


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`start listening on port ${port}`);
});
