const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../routes/users/models/User');
const bcrypt = require('bcryptjs');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  await User.findById(id, (err, user) => {
    done(err, user);
  });
});

const authenticatePassword = async (inputPassword, user, done, req) => {
  const exists = await bcrypt.compare(inputPassword, user.password);

  if (!exists) {
    console.log('Invalid Login');
    return done(null, false, req.flash('errors', 'Check email or password'));
  }

  return done(null, user);
};

const verifyCallback = async (req, email, password, done) => {
  await User.findOne({ email }, (err, user) => {
    try {
      if (!user) {
        console.log('No user has been found');
        return done(null, false, req.flash('errors', 'No user has been found'));
      }
      authenticatePassword(password, user, done, req);
    } catch (error) {
      done(error, null);
    }
  });
};

passport.use(
  'local-login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    verifiedCallback
  )
);
