var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var bookshelf = require('../config/bookshelf');

var User = require('./User');
var Aggiunte = require('./Aggiunte');
var Voto = require('./Voto');

var News = bookshelf.Model.extend({
  tableName: 'notizie',
  uuid: true,
  hasTimestamps: true,

  user: function(){
    return this.hasOne(User);
  },

  aggiuntivi : function(){
    return this.hasMany(Aggiunte,'notizia_id');
  },

  voti : function(){
    return this.hasMany(Voto,'notizia_id');
  }
});

module.exports = News;
