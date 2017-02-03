var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var bookshelf = require('../config/bookshelf');

var Token = require('./Token');
var News = require('./News');
var Voto = require('./Voto');

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

  hidden: ['password', 'passwordResetToken', 'passwordResetExpires'],

  virtuals: {
    gravatar: function() {
      if (!this.get('email')) {
        return 'https://gravatar.com/avatar/?s=200&d=retro';
      }
      var md5 = crypto.createHash('md5').update(this.get('email')).digest('hex');
      return 'https://gravatar.com/avatar/' + md5 + '?s=200&d=retro';
    }
  },

  tokens: function(){
    return this.hasMany(Token);
  },

  news: function(){
    return this.hasMany(News);
  },

  voti : function(){
    return this.hasMany(Voto);
  }
});

module.exports = User;
