const log = console.log;
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { User } = require('../models');

// 로그인 전략 local.js 부분 
module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
  }, async (email, password, done) => {
    try {
      const user = await User.findOne({
        where : { email }
      });
      if(!user) {
        return done(null, false, { reason: '존재하지 않는 아이디 입니다.'});
      }
      const passwordCheck = await bcrypt.compare(password, user.password);
      if(passwordCheck) {
        return done(null, user);
      } else {
        return done(null, false, {reason: '비밀번호가 틀렸습니다'});
      }
    } catch (err) {
      console.error(err);
      done(err);
    }
  }
  ));
}

// done (server에 보낼메세지, 성공 여부 bool, {reson: '클라이언트 메세지 2번째인수가 false 일때 설정'})