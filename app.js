
/**
 * Module dependencies.
 */
var express          = require('express')
  , http             = require('http')
  , path             = require('path')
  , passport         = require('passport')
  , engine           = require('ejs-locals')
;

var authController = require('./authController')
  , routes = require('./routes')
  , user = require('./routes/user')
;
var app = express();

// mongoose setup
var mongoose = require('mongoose')
var databaseUrl = process.env.DATABASE_URL || 'mongodb://localhost/rateprofessor';
mongoose.connect(databaseUrl);

// passport configure
authController.passportConfigure();

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('DRGRWTHAEGERQYrewtyhhilDS'));
  app.use(express.session());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(require('less-middleware')({
    src    : path.join(__dirname, 'assets', 'less'),
    paths  : [path.join(__dirname, 'node_modules', 'bootstrap', 'less')],
    dest   : path.join(__dirname, 'public', 'stylesheets'),
    prefix : '/stylesheets',
    once   : 'production' == app.get('env') ? true : false
  }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

app.get('/signup', function(req, res){
  res.render('signup', { title: '註冊' });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
