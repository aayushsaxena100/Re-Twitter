var express = require('express');
var path = require('path');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');
var followUnfollow = require('./routes/followUnfollow');
var tweet = require('./routes/tweet');
var loginLogoutSignup = require('./routes/loginLogoutSignup');

var monk = require('monk');
//var db = monk('localhost:27017/ReTwitter');			
//var db = monk('localhost:27017/ReTwitterTest'); 	
//var db = monk('mongodb://tester:tester123@ds055945.mlab.com:55945/retwittertest');
var db = monk('mongodb://tester:tester123@ds145053.mlab.com:45053/retwitter');
var app = express();


if(process.env.NODE_ENV == 'test')
{
  db = monk('mongodb://tester:tester123@ds055945.mlab.com:55945/retwittertest');
}

app.use(function(req,res,next){
    req.db = db;
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({secret: '12lkhcgc4nc5ds86fd89hdnn5k5vy2v', resave: true, saveUninitialized: true}));
app.use(bodyParser.json());
//app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/', followUnfollow);
app.use('/', tweet);
app.use('/', loginLogoutSignup);

var PORT = process.env.PORT || 3000;
//var io = require('socket.io').listen(app.listen(port));
app.listen(PORT, function(){
  console.log("Listening on port "+ PORT);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;