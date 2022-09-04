const log = console.log;
const express = require('express');
const router = express.Router();
const {User, Post} = require('../models/index');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn} = require('../routes/middlewares')



// login 유지 
router.get('/', async (req, res, next) => { // GET /user
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ['password']
        },
        include: [{
          model: Post,
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id','nickname'],
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id', 'nickname'],
        }]
      })
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
   next(error);
   
  }
});
router.get('/:userId', async (req, res, next) => { // GET /user/:userId
  try {
    const isUser = await User.findOne({
      where : {id : req.params.userId}
    });
    if(!isUser) {
      return res.status(403).send('There is no account');
    } 
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.userId },
      attributes: {
        exclude: ['password']
      },
      include: [{
        model: User,
        as: 'Followings',
        attributes: ['id','nickname'],
      }, {
        model: User,
        as: 'Followers',
        attributes: ['id','nickname'],
      }]
    })
    res.status(200).json(fullUserWithoutPassword);
  } catch (error) {
    console.error(error);
   next(error);
   
  }
});

// 다른유저 정보 가져오기 Followings, Followers 동일 /user/:userId


router.post('/join', async (req, res, next)=>{ // 회원가입
  try {
    const { email, password, nickname } = req.body;
    const isUser = await User.findOne({
      where : {email}
    });
    if(isUser) {
      return res.status(403).send('이미 있는 아이디 입니다.');
    } 
    const data = {};
    data.email = email;
    data.password = bcrypt.hashSync(password, 12);
    data.nickname = nickname;
    await User.create(data);
    res.status(200).send('회원가입 성공');
  } catch(err) {
    console.error(err);
    next(err);
  }
});

// login 
router.post('/login', isNotLoggedIn, (req, res, next)=>{
  // 'local' 'google' 'kakao' 여러 플랫폼이 있다 => req 에서 값으로 받는게 좋을듯
  passport.authenticate('local', (err, user, info)=>{ // login.js 를 실행
    // server error
    if(err) {
      console.error(err);
      return next(err);
    }
    // client error
    if(info) {
      return res.status(403).send(info.reason);
    }
    // req.login 실행할때 config.js 를 실행함, 후에 client 에 user 응답 
    return req.login(user, async (loginErr)=>{
      if(loginErr) return next(loginErr);
      
      const data = await User.findOne({
        where: {id : user.id},
        attributes: {
          exclude: ['password']
        },
        include: [{
          model: Post,
        }, {
          model: User,
          as: 'Followings'
        }, {
          model: User,
          as: 'Followers'
        }]
      });

      return res.json(data);
    })
  })(req, res, next); // 미들웨어 확장 시킬때 (req, res, next) 를 못사용 할 경우 사용함
});

router.post('/logout', isLoggedIn, (req, res, next)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.send('success logout');
  });
});


router.patch('/update', isLoggedIn, async (req, res, next) => {
  try {
    await User.update({ 
      nickname: req.body.nickname 
    }, { 
      where: {id: req.user.id} 
    });
    res.status(200).send({nickname: req.body.nickname});
  } catch (err) {
    console.error(err);
    next(err);
  }
});


router.patch('/:userId/follow',isLoggedIn, async (req, res, next)=> { // 팔로우 추가
  try {
    
    const isUser = await User.findOne({
      where : {id : req.params.userId}
    });
    if(!isUser) {
      return res.status(403).send('There is no account');
    } 
    const test = await isUser.addFollowers(req.user.id);
    
    res.status(200).send('OK');
  } catch(err) {
    console.error(err);
    next(err);
  }
});

router.delete('/:userId/follow', isLoggedIn, async (req, res, next)=> { // MY 팔로우 삭제
  try {
    const user = await User.findOne({ where: { id: req.params.userId }});
    if (!user) {
      res.status(403).send('there is no account for unfollowing');
    }
    console.log(`isUser?:`, user)
    await user.removeFollowers(req.user.id);
    res.status(200).send('follow DELETE OK');
  } catch(err) {
    console.error(err);
    next(err);
  }
});
router.delete('/:userId/following', isLoggedIn, async (req, res, next)=> { // MY 팔로잉 삭제
  const user = await User.findOne({ where: { id: req.params.userId }});
  if (!user) {
    res.status(403).send('없는 사람을 언팔로우하려고 하시네요?');
  }
return;
});


module.exports = router;