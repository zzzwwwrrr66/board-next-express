const log = console.log;
const express = require('express');
const db = require('./models/index');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();
const passport = require('passport');
const passportConfig = require('./passport/config');
const morgan = require('morgan');
const path = require('path');
const hpp = require('hpp');

// routes S 
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const searchRouter = require('./routes/search');
const helmet = require('helmet');

// routes E 

const app = express();
db.sequelize.sync({force: false})
.then(()=>{log('DB 연결')})
.catch((err)=>{console.error(`데이터 베이스 에러`,err)});

if(process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(hpp());
  app.use(helmet());
} else {
  app.use(morgan('dev'));
}


// cors S 
app.use(cors({
  // http://localhost:5500/node_express_react_by_wooram/front/,
  // origin: 'http://localhost:5500/',
  origin: ['http://localhost:3060', 'nodebird.com', 'wooramBoard.com'],
  credentials: true,
}));
// static S
app.use('/', express.static(path.join(__dirname, 'images')));
// req.body 사용 S
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// login(passport)
passportConfig();
// session & cookie
app.use(cookieParser(process.env.COOKIE_SECRET), );
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(passport.initialize());
app.use(passport.session());


// routes S
app.get('/', (req, res, next)=> {
  res.send('index success');
});
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/search', searchRouter);
// routes E

// 404
app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// err
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});


app.listen(process.env.NODE_ENV === 'production' ? 80 : 8080, ()=>{
  log('server on ' + process.env.NODE_ENV === 'production' ? '80' : '8080');
});   