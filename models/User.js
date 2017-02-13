var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var bookshelf = require('../config/bookshelf');

var NotificationToken = require('./NotificationToken');
var Token = require('./Token');
var News = require('./News');
var Voto = require('./Voto');
var LocationUser = require('./LocationUser');

var User = bookshelf.Model.extend({
  tableName: 'users',
  uuid: true,
  hasTimestamps: true,

  hashPassword: function(model, attrs, options) {
    var password = options.patch ? attrs.password : model.get('password');
    if (!password) { return; }
    return new Promise(function(resolve, reject) {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, null, function(err, hash) {
          if (options.patch) {
            attrs.password = hash;
          }
          model.set('password', hash);
          resolve();
        });
      });
    });
  },

  comparePassword: function(password, done) {
    var model = this;
    bcrypt.compare(password, model.get('password'), function(err, isMatch) {
      done(err, isMatch);
    });
  },

  hidden: ['password', 'passwordResetToken', 'passwordResetExpires','facebook_token'],

  virtuals: {
    gravatar: function() {
      if (!this.get('email')) {
        return 'https://gravatar.com/avatar/?s=200&d=retro';
      }
      var md5 = crypto.createHash('md5').update(this.get('email')).digest('hex');
      return 'https://gravatar.com/avatar/' + md5 + '?s=200&d=retro';
    },
    score : function(){
      var score = 0;
      var notizie = this.related('notizie').toJSON();
      if(notizie){
        for(var i = 0 ; i < notizie.length ; i++){
          for(var k = 0; k < notizie[i]["voti"].length ; k++){
            switch (notizie[i]["voti"][k]["voto"]) {
              case "UP":
                score = score + 1 ;
                break;
              case "AUTHOR_UP":
                score = score + 2 ;
                break;
              case "EDITOR_UP":
                score = score + 3 ;
                break;
              case "MOD_UP":
                score = score + 5 ;
                break;
              case "ADMIN_UP":
                score = score + 5 ;
                break;
              case "DOWN":
                score = score - 1 ;
                break;
              case "AUTHOR_DOWN":
                score = score - 2 ;
                break;
              case "EDITOR_DOWN":
                score = score - 3 ;
                break;
              case "MOD_DOWN":
                score = score - 5 ;
                break;
              case "ADMIN_DOWN":
                score = score - 5 ;
                break;
              default:
                break;
            }
          }
        }
      }
      return score;
    }
  },

  tokens: function(){
    return this.hasMany(Token);
  },

  notificationTokens: function(){
    return this.hasMany(NotificationToken);
  },

  notizie: function(){
    return this.hasMany(News);
  },

  voti : function(){
    return this.hasMany('Voto');
  },

  location : function(){
    return this.hasOne(LocationUser);
  }
});

module.exports = bookshelf.model('User',User);
