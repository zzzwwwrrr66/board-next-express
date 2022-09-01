const log = console.log;
const express = require('express');
const router = express.Router();
const sequelize = require("sequelize");
const Op = sequelize.Op;

const {User, Post, Image} = require('../models/index');
const { isLoggedIn, isNotLoggedIn} = require('../routes/middlewares')

router.get('/:searchInfo', async (req, res, next)=>{
  try {
    let pageNum = req.query.offset; // 요청 페이지 넘버
    let offset = 0;

    if(pageNum > 1){
      offset = 10 * (pageNum - 1);
    }
    const result = await Post.findAll({
      offset: offset,
      limit: 10,
      order: [['createdAt', 'DESC']],
      where:{
        [Op.or]: [
          {
            title: {
                [Op.like]: "%" + req.params.searchInfo + "%"
            }
          },
          {
            content: {
                [Op.like]: "%" + req.params.searchInfo + "%"
            }
          }
        ]
      },
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
      }]
    });
    console.log('wooramtest: ', req.params.searchInfo, result);
    res.status(200).json({
      data: result,
      dataCount: result.length
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});


module.exports = router;