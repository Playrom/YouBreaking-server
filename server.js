var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var exphbs = require('express-handlebars');
var passport = require('passport');

// Load environment variables from .env file
dotenv.load();

// Controllers
var HomeController = require('./controllers/home');
var userController = require('./controllers/user');
var contactController = require('./controllers/contact');
var profileController = require('./controllers/profile');
var newsController = require('./controllers/news');
var eventsController = require('./controllers/events');
var auth = require('./controllers/authenticate');
var likeController = require('./controllers/like');

// Passport OAuth strategies
require('./config/passport');

var app = express();


var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    ifeq: function(a, b, options) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    toJSON : function(object) {
      return JSON.stringify(object);
    }
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 4);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json({limit: '20mb' , extended: true }));
app.use(bodyParser.urlencoded({limit: '20mb' , extended: true }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user ? req.user.toJSON() : null;

  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

  next();
});
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', HomeController.index);
// app.get('/contact', contactController.contactGet);
// app.post('/contact', contactController.contactPost);
// app.get('/account', userController.ensureAuthenticated, userController.accountGet);
// app.put('/account', userController.ensureAuthenticated, userController.accountPut);
// app.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
// app.get('/signup', userController.signupGet);
// app.post('/signup', userController.signupPost);
// app.get('/login', userController.loginGet);
// app.post('/login', userController.loginPost);
// app.get('/forgot', userController.forgotGet);
// app.post('/forgot', userController.forgotPost);
// app.get('/reset/:token', userController.resetGet);
// app.post('/reset/:token', userController.resetPost);
// app.get('/logout', userController.logout);
// app.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);

app.get("/auth/facebook/token", function(req, res, next){
    req.url = "/api/auth/facebook/token";
    next();
});
app.get("/auth/facebook", function(req, res, next){
    req.url = "/api/auth/facebook";
    next();
});
app.get("/auth/facebook/callback", function(req, res, next){
    req.url = "/api/auth/facebook/callback";
    next();
});

app.get(
    "/api/auth/facebook/token",
    (req, res) => {
      passport.authenticate('facebook-token', function (err, token, info) {
            if(err == null){
              res.status(200).send(token);
            }else{
              console.log(err);
            }
      })(req, res);
    }
);
app.get('/api/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/api/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));
app.get(
  '/api/auth/check', 
  (req, res) => {
      passport.authenticate('jwt', { session: false}, 
        function (err, token, info) {
            if(err == null && info == null){
              res.status(200).send(token);
            }else if(info!= null){
              res.status(401).send(info);
            }else{
              console.log(err);
            }
        })(req, res);
  }
);
app.post('/api/auth/logout', auth.config, auth.authenticate, profileController.logout);
app.get('/api/profile', auth.config, passport.authenticate('jwt', { session: false}), profileController.getProfile);
app.put('/api/profile/:id', auth.config, auth.authOrAdmin, profileController.editProfile);
app.post('/api/profile/location', auth.config, auth.authenticate, profileController.userLocation);
app.delete('/api/profile/location', auth.config, auth.authenticate, profileController.deleteUserLocation);
app.put('/api/profile/location/distance', auth.config, auth.authenticate, profileController.userLocationDistance);
app.post('/api/register/ios', auth.config, auth.authenticate, profileController.locationNotification);

app.put('/api/news/promote/:id', auth.config, auth.modOrAdmin, newsController.promote);
app.get('/api/news/:id', auth.config, auth.passUser, newsController.getSingleNews);
app.get('/api/news/:id/likes', auth.config, auth.passUser, newsController.getSingleNewsLikes);
app.delete('/api/news/:id', auth.config, auth.authenticate, newsController.delete);
app.get('/api/news', auth.config, auth.passUser, newsController.getNews);
app.post('/api/news', auth.config, auth.authenticate, newsController.postNews);
app.post('/api/likes', auth.config, auth.authenticate, likeController.postLike);
app.delete('/api/likes', auth.config, auth.authenticate, likeController.deleteLike);

app.get('/api/events/:id', auth.config, auth.passUser, eventsController.getSingleEvent);
app.get('/api/events', auth.config, auth.passUser, eventsController.getEvents);
app.post('/api/events', auth.config, auth.authenticate, eventsController.postEvent);

app.get('/api/users/:id', auth.config, profileController.getUser);


/*app.get('/auth/profile', passport.authenticate('jwt', { session: false }),
    function(req, res) {
        res.send(req.user.profile);
    }
);*/

var http = require('http');


if (process.env.PRODUCTION == "false"){
  
  var httpServer = http.createServer(app);
  httpServer.listen(5000,function(){
    console.log('Server listening on port ' + 5000);
  });
}

// Production error handler
if (process.env.PRODUCTION == "true") {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });

  var httpServer = http.createServer(app);
  httpServer.listen(5000,function(){
    console.log('HTTP Server listening on port ' + 5000);
  });

}



module.exports = app;
