var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var bookshelf = require('../config/bookshelf');

var User = require('./User');
var News = require('./News');

var Aggiunte = bookshelf.Model.extend({
  tableName: 'aggiuntivi',
  uuid: true,
  hasTimestamps: true,

  notizie : function(){
    return this.hasOne(News);
  },

      hidden: ['created_at', 'updated_at', 'notizia_id'],

});

module.exports = Aggiunte;
