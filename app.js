var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');

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
  description: String,
  created : {
    type: Date,
    default: Date.now
  }
});

var Blogs = mongoose.model('blog', blogSchema);

// Blogs.create({
//   title: 'My First Post',
//   image : 'https://images.unsplash.com/photo-1452698325353-b90e60289e87?dpr=1&auto=compress,format&fit=crop&w=1199&h=799&q=80&cs=tinysrgb&crop=',
//   description : 'Trying out how this works'
// }, function(err, result){
//   if(err){
//     console.log(err);
//   } else {
//     console.log('Sucess');
//     console.log(result);
//   }
// });

//https://images.unsplash.com/photo-1452698325353-b90e60289e87?dpr=1&auto=compress,format&fit=crop&w=1199&h=799&q=80&cs=tinysrgb&crop=

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));

//method override will override a post into another (put or delete)
//it takes in an argument, which is the query string it looks for as an override
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSanitizer());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// app.use('/', index);
// app.use('/users', users);


app.get('/', function(req, res){
  res.redirect('/blogs');
});

app.get('/blogs', function(req, res){
  Blogs.find({}, function(err, blogs){
    if(err){
      console.log(err);
    } else {
        res.render('index', {blogs: blogs});
    }
  });
});

//NEW ROUTE
app.get('/blogs/new', function(req, res){
  res.render('new');
});

//SHOW ONE Route
app.get('/blogs/:id', function(req, res){
  var id = req.params.id;

  Blogs.findById(id, function(err, foundBlog){
    if(err){
      console.log(err);
    } else {
      res.render('show', {foundBlog: foundBlog});
    }
  });
});

//POST from NEW
app.post('/blogs', function(req, res){
  var name = req.body.blogTitle;
  var image = req.body.blogImage;
  var desc = req.sanitize(req.body.blogDesc);

  if(name === '' || name === null){
    name = 'No Title';
  }

  if(image === '' || image === null){
    image = 'https://images.unsplash.com/photo-1475770230762-6409e81d7589?dpr=1&auto=compress,format&fit=crop&w=1199&h=799&q=80&cs=tinysrgb&crop=';
  }
  Blogs.create({
    title: name,
    image: image,
    description: desc
  }, function(err, result){
    if(err){
      console.log(err);
    } else {
      console.log('Added ' + result.title);
      res.redirect('/blogs');
    }
  });
});


//EDIT ROUTE
app.get('/blogs/:id/edit', function(req, res){
  var id = req.params.id;

  Blogs.findById(id, function(err, foundBlog){
    if(err){
      console.log(err);
    } else {
      res.render('edit', {foundBlog: foundBlog});
    }
  });
});

//UPDATE ROUTE
app.put('/blogs/:id', function(req, res){
  var id = req.params.id;
  var name = req.body.blogTitle;
  var image = req.body.blogImage;
  var desc = req.sanitize(req.body.blogDesc);

  //  Blogs.findByIdAndUpdate(id, newData, callback);
  Blogs.findByIdAndUpdate(id, {
    title: name,
    image: image,
    description: desc
  }, function(err, result){
    if(err){
      console.log(err);
    } else {
      console.log('Successfully Updated!');
      //redirect back to whereever get route you want
      res.redirect('/blogs');
    }
  });
});

// app.get('/blogs/:id/delete', function(req, res){
//   Blogs.findById(req.params.id, function(err, result){
//     if(err){
//       console.log(err);
//     } else {
//       console.log(result);
//       res.send('DELETE GET');
//     }
//   });
// });
//DELETE ROUTE
app.delete('/blogs/:id', function(req, res){
  var id = req.params.id;
  Blogs.findOneAndRemove({'_id': id}, function(err, result){
    if(err){
      console.log(err);
    } else {
      res.redirect('/blogs');
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
