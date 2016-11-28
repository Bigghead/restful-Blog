var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//mongoose database setup
mongoose.connect('mongodb://localhost/coltBlogs');

var blogSchema = new mongoose.Schema({
  title : String,
  image : String,
  description: String
});

var Blogs = mongoose.model('blog', blogSchema);

Blogs.create({
  title: 'My First Post',
  image : 'https://source.unsplash.com/random',
  description : 'Trying out how this works'
}, function(err, result){
  if(err){
    console.log(err);
  } else {
    console.log('Sucess');
    console.log(result);
  }
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// app.use('/', index);
// app.use('/users', users);


app.get('/', function(req, res){
  Blogs.find({}, function(err, blogs){
    if(err){
      console.log(err);
    } else {
        res.render('index', {blogs: blogs});
    }
  });
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
  res.render('error');
});

// module.exports = router;

app.listen('8000', function(){
  console.log('Blog Now Running!');
});
