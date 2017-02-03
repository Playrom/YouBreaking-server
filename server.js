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
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user ? req.user.toJSON() : null;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', HomeController.index);
app.get('/contact', contactController.contactGet);
app.post('/contact', contactController.contactPost);
app.get('/account', userController.ensureAuthenticated, userController.accountGet);
app.put('/account', userController.ensureAuthenticated, userController.accountPut);
app.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
app.get('/signup', userController.signupGet);
app.post('/signup', userController.signupPost);
app.get('/login', userController.loginGet);
app.post('/login', userController.loginPost);
app.get('/forgot', userController.forgotGet);
app.post('/forgot', userController.forgotPost);
app.get('/reset/:token', userController.resetGet);
app.post('/reset/:token', userController.resetPost);
app.get('/logout', userController.logout);
app.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);

app.get(
    "/auth/facebook/token",
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
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));
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
app.post('/api/auth/logout', profileController.authenticate, profileController.logout);
app.get('/api/profile', passport.authenticate('jwt', { session: false}), profileController.getProfile);
app.put('/api/profile/:id', profileController.authOrAdmin, profileController.editProfile);

app.get('/api/news/:id', newsController.passUser, newsController.getSingleNews);
app.get('/api/news', newsController.passUser, newsController.getNews);
app.post('/api/news', newsController.authenticate, newsController.postNews);
app.post('/api/vote', newsController.authenticate, newsController.postVote);
app.get('/api/vote', newsController.authenticate, newsController.getWaitVotesUser);


/*app.get('/auth/profile', passport.authenticate('jwt', { session: false }),
    function(req, res) {
        res.send(req.user.profile);
    }
);*/

// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
