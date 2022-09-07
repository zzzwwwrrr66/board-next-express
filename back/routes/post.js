const log = console.log;
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { User, Post, Comment, Image, Hashtag } = require('../models/index');
const { isLoggedIn, isNotLoggedIn} = require('../routes/middlewares');
const fs = require('fs');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

// make folder
try {
  fs.accessSync('images');
} catch (error) {
  console.log('uploads 폴더가 없으므로 생성합니다.');
  fs.mkdirSync('images');
}
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-1',
});
const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'wooram-board-fe-be',
    key(req, file, cb) {
      cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`)
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

/* local
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'images');
    },
    filename(req, file, done) { // 제로초.png
      const ext = path.extname(file.originalname); // 확장자 추출(.png)
      const basename = path.basename(file.originalname, ext); // 제로초
      done(null, basename + '_' + new Date().getTime() + ext); // 제로초15184712891.png
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});
*/

router.post('/', isLoggedIn, upload.none(), async (req, res, next)=>{ // add one post
  try{
    const hashTags = (req.body.title+' '+req.body.content).match(/#[^\s#]+/g);
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      UserId: req.user.id
    });

    if (hashTags) {
      const result = await Promise.all(hashTags.map((tag) => Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() },
      }))); // [[노드, true], [리액트, true]]
      await post.addHashtags(result.map((v) => v[0]));
    }
    

    if(req.body.image) {
      if(Array.isArray(req.body.image)) {
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
        await post.addImages(images);
      } else {
        const image = await Image.create({src: req.body.image})
        await post.addImages(image);
      }
    }
    
    res.status(201).send(req.body);
    // res.status(201).send(post);
  } catch(err) {
    console.error(err);
    next(err);
  }
});


// router.post('/images', isLoggedIn, upload.array('image'), (req, res, next)=> {
//   try {
//     res.json(req.files.map((v) => v.filename));
//   } catch(err){
//     console.error(err);
//     next(err);
//   }
// });
router.post('/images', isLoggedIn, upload.array('image'), (req, res, next) => { // POST /post/images
  console.log(req.files);
  res.json(req.files.map((v) => v.location.replace(/\/original\//, '/thumb/')));
});

router.get('/list', async (req,res,next)=>{ // get post list
  try{
    const where = {};
    // 인피니티 스크롤 
    // 초기 로딩이 아닐 때　// 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
    // if (parseInt(req.query.lastId, 10)) {
    //   where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
    // } 
    let pageNum = req.query.offset; // 요청 페이지 넘버
    let offset = 0;

    if(pageNum > 1){
      offset = 10 * (pageNum - 1);
    }
    const data = await Post.findAll({
      where,
      offset: offset,
      order: [['createdAt', 'DESC']],
      limit: 10,
      include: [{
        model: User,
        attributes: ['id', 'nickname']
      },
      {
        model: User,
        as: 'Likers',
        attributes: ['id'],
      },{
        model: Image,
        attributes: ['src']
      }
    ],
    });
    const dataCount = await Post.findAll();
    res.status(200).json({
      data,
      dataCount: dataCount.length
    });
  } catch(err){
    console.error(err);
      next(err);
  }
});

router.get('/:postId',  async (req, res, next)=>{ // get one post by postId
  try {
    const isPost = await Post.findOne({
      where: {id : req.params.postId},
      include: [
        {
          model: Image,
        },{
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Comment,
      }, {
        model: User,
        as: 'Likers',
        attributes: ['id'],
      }],
    });
    if(!isPost) {
      return res.status(404).send('NO');
    } else {
      return res.status(200).json(isPost);
    }
    
  }
  catch(err) {
    console.error(err);
    next(err);
  }
});





router.get('/:postId/comment', async (req, res, next)=>{ // get comment
  try{
    if(req.params.postId) {
      const data = await Comment.findAll({
        where: {postId: (req.params.postId)},
        order: [['createdAt', 'DESC']],
        include: [{
          model: User,
          attributes: ['id', 'nickname']
        }],
      });
      res.status(200).json(data);
    }
    return false;
  } catch(err){
    console.error(err);
    next(err);
  }
});


router.post('/:postId/comment', isLoggedIn, async (req, res, next)=>{ // add comment
  try{
    // comment '/:postId/comment' postId 있는지 검사 
    const isPost = await Post.findOne({
      where: {id: req.body.postId}
    })
    if(isPost) {
      const post = await Comment.create({
        content: req.body.content,
        UserId: req.user.id,
        PostId: req.body.postId,
      });  
      res.status(201).send(post);
    } else {
      res.status(404).send('존재하지않는 포스트입니다');
    }
  } catch(err) {
    console.error(err);
    next(err);
  }
});
router.patch('/:postId/like', isLoggedIn, async (req, res, next)=>{ // add like
  try{
    const isPost = await Post.findOne({
      where: {id: req.params.postId}
    });
    
    if(isPost) {
      await isPost.addLikers(req.user.id);
      res.json({ PostId: isPost.id, UserId: req.user.id });
    } else {
      res.status(404).send('존재하지않는 포스트입니다');
    }
  } catch(err) {
    console.error(err);
    next(err);
  }
});

router.delete('/:postId/like', isLoggedIn, async (req, res, next)=>{ // Delete like => unlike
  log('wooram delete', )
  try{
    const isPost = await Post.findOne({
      where: {id: req.params.postId}
    });
    if(isPost) {
      await isPost.removeLikers(req.user.id);
      res.json({ PostId: isPost.id, UserId: req.user.id });
    } else {
      res.status(404).send('존재하지않는 포스트입니다');
    }
  } catch(err) {
    console.error(err);
    next(err);
  }
});


router.delete('/:postId', isLoggedIn, async (req, res, next)=>{ // Delete post content
  try {
    await Post.destroy({
      where: {
        id: req.params.postId,
        UserId: req.user.id
      }
    });
    res.status(200).send('success delete post '+req.params.postId);
  }
  catch(err) {
    console.error(err);
    next(err);
  }
});


module.exports = router;