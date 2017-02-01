var passport = require('passport');
var request = require('request');

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var FacebookTokenStrategy = require('passport-facebook-token');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var cfg = require("./config.js"); 

var User = require('../models/User');
var Token = require('../models/Token');


passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  new User({ id: id}).fetch().then(function(user) {
    done(null, user);
  });
});

// Questo è il sistem di autenticazione tramite Email e Password
passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  new User({ email: email })
    .fetch()
    .then(function(user) {
      if (!user) {
        return done(null, false, { msg: 'The email address ' + email + ' is not associated with any account. ' +
        'Double-check your email address and try again.' });
      }
      user.comparePassword(password, function(err, isMatch) {
        if (!isMatch) {
          return done(null, false, { msg: 'Invalid email or password' });
        }
        return done(null, user);
      });
    });
}));

// Sistema di autenticazione tramite finestra di dialogo di facebook
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['name', 'email', 'gender', 'location'],
  passReqToCallback: true
}, function(req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    new User({ facebook: profile.id })
      .fetch()
      .then(function(user) {
        if (user) {
          req.flash('error', { msg: 'There is already an existing account linked with Facebook that belongs to you.' });
          return done(null);
        }
        new User({ id: req.user.id })
          .fetch()
          .then(function(user) {
            user.set('name', user.get('name') || profile.name.givenName + ' ' + profile.name.familyName);
            user.set('picture', user.get('picture') || 'https://graph.facebook.com/' + profile.id + '/picture?type=large');
            user.set('facebook', profile.id);
            user.save(user.changed, { patch: true }).then(function() {
              req.flash('success', { msg: 'Your Facebook account has been linked.' });
              done(null, user);
            });
          });
      });
  } else {
    new User({ facebook: profile.id })
      .fetch()
      .then(function(user) {
        if (user) {
          return done(null, user);
        }
        new User({ email: profile._json.email })
          .fetch()
          .then(function(user) {
            if (user) {
              req.flash('error', { msg: user.get('email') + ' is already associated with another account.' });
              return done();
            }
            user = new User();
            user.set('name', profile.name.givenName + ' ' + profile.name.familyName);
            user.set('email', profile._json.email);
            user.set('picture', 'https://graph.facebook.com/' + profile.id + '/picture?type=large');
            user.set('facebook', profile.id);
            user.save().then(function(user) {
              done(null, user);
            });
          });
      });
  }
}));

// Sistema di autenticazione tramite token facebook generato dal clientID

passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    profileFields: ['name', 'email', 'gender', 'location'],
    passReqToCallback: true,
    enableProof : false
  }, function(req, accessToken, refreshToken, profile, done) {
    
    // Creo una richiesta http per generare un token a lunga scadenza per facebook da immagazzinare
    // Viene rigenerato ad ogni login

    var baseurl = "https://graph.facebook.com/v2.8/oauth/access_token?grant_type=fb_exchange_token&";
    baseurl = baseurl + "client_id=" + process.env.FACEBOOK_ID + "&";
    baseurl = baseurl + "client_secret=" + process.env.FACEBOOK_SECRET + "&";
    baseurl = baseurl + "fb_exchange_token=" + accessToken + "&";
    
    request(baseurl,function (error, response, body) {
      
      if (!error && response.statusCode == 200) {
        
        var json = JSON.parse(body); // Genero un oggetto aprtendo dalla risposta di facebook

        new User({ facebook: profile.id }) // Genero un nuovo modello partendo dal id preso da facebook
          .fetch()
          .then(function(user) {

            var access_token = json.access_token;
            user.set('facebook_token', access_token);
            user.save().then(function(user) {

            });

            if (user) { // Se l'utente esiste già allora non devo creare nulla, solo generare il Token JWT
              var jwt = require('jsonwebtoken');
              var token = jwt.sign(user.toJSON(), cfg.jwtSecret);
              var arr = {
                token : token,
                error : false
              }

              var t = new Date();
              t.setSeconds(t.getSeconds() + (60*60*24*7)); // Sette Giorni
              var exp = t.toISOString().slice(0, 19).replace('T', ' ');

              new Token({token : token , user_id : user.toJSON().id, exp : exp}).save().then(function(token){

              });

              return done(null, arr);
            }
            
            // Se  l'utente non esiste già allora devo creare un utente
            new User({ email: profile._json.email })
              .fetch()
              .then(function(user) {
                if (user) { // Se esiste già una email per questo utente genero un errore
                  req.flash('error', { msg: user.get('email') + ' is already associated with another account.' });
                  return done();
                }
                
                user = new User();
                user.set('name', profile.name.givenName + ' ' + profile.name.familyName);
                user.set('email', profile._json.email);
                user.set('picture', 'https://graph.facebook.com/' + profile.id + '/picture?type=large');
                user.set('facebook', profile.id);

                var access_token = json.access_token;
                console.log(access_token);

                user.set('facebook_token', access_token);

                user.save().then(function(user) {

                  var jwt = require('jsonwebtoken');
                  var token = jwt.sign(user.toJSON(), cfg.jwtSecret);
                  var arr = {
                    token : token,
                    error : false
                  }

                  var t = new Date();
                  t.setSeconds(t.getSeconds() + (60*60*24*7)); // Sette Giorni
                  var exp = t.toISOString().slice(0, 19).replace('T', ' ');

                  new Token({token : token , user_id : user.toJSON().id , exp:exp}).save().then(function(token){

                  });

                  done(null, arr);

                })
                .catch(function(err) {
                  console.error(err);
                });

              });
          });
        


      }
    })

    

  }
));

 
var opts = {}
var extractor = ExtractJwt.fromAuthHeader();
opts.jwtFromRequest = extractor;
opts.secretOrKey = cfg.jwtSecret;
opts.passReqToCallback = true
passport.use(new JwtStrategy(opts, function(req,jwt_payload, done) {
    var token = extractor(req);
    new Token({user_id:jwt_payload.id, token : token}).fetch().then(function(token){

      if(token){

        var dt = token.toJSON().exp;
        var tokenDate = dt.getTime() / 1000;

        var now = Date.now();
        var now = now / 1000;

        if(tokenDate <= now){
          done(null,false,{error:true , message: "ExpiredToken"});
        }else{

          new User({ id: jwt_payload.id })
          .fetch()
          .then(function(user,err) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
                // or you could create a new account
            }
          })
        
        }

      }else{
        console.log("Errore EXP");
        done(null,false);
      }
  }).catch(function(err){
    console.log(err);
    done(null,false);
  })

    
}));