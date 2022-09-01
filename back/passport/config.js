const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
  passport.serializeUser((user, done)=>{
    done(null, user.id);
  });

  passport.deserializeUser( async (id, done)=>{
    try {
      const user = await User.findOne({ where: { id }});
      done(null, user); // req.user 에 넣어준다
    } catch (err) {
      console.error(err);
      done(err);
    }
  });

  local();
};
