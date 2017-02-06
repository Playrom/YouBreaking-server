var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var bookshelf = require('../config/bookshelf');

var News = require('./News');

var Evento = bookshelf.Model.extend({
  tableName: 'events',
  uuid: true,
  hasTimestamps: true,

  notizie : function(){
    return this.hasMany('News');
  },

      hidden: ['created_at', 'updated_at'],

});

module.exports = bookshelf.model('Evento',Evento);
