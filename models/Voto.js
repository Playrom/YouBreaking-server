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
  user : function(){
    return this.belongsTo('User');
  },

    hidden: ['created_at', 'updated_at', 'notizia_id'],

});

module.exports = bookshelf.model('Voto',Voto);
