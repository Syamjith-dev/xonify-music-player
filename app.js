const fileUpload = require('express-fileupload'); 

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { engine } = require('express-handlebars');
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var db = require('./config/connection');

var app = express();
var session = require('express-session')

// view engine setup
app.engine(
  'hbs',
  engine({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, 'views/layout'),
    partialsDir: path.join(__dirname, 'views/partials'),
  })
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ ONLY THIS ONE (correct config)
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

app.use(session({secret:"secretKey",cookie:{maxAge: oneYearInMs * 10}}))

db.connect((err) =>{
  if(err)
    console.log("error");
  else
    console.log("database connected")
})

app.use('/', userRouter);
app.use('/admin', adminRouter);

// 404
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;