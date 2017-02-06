var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var bookshelf = require('../config/bookshelf');

var User = require('./User');
var News = require('./News');

var Voto = bookshelf.Model.extend({
  tableName: 'voti',
  uuid: true,
  hasTimestamps: true,

  notizia : function(){
    return this.belongsTo(News);
  },
  utente : function(){
    return this.hasOne(User);
  },

    hidden: ['created_at', 'updated_at', 'notizia_id'],

});

module.exports = Voto;
