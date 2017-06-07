var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var bookshelf = require('../config/bookshelf');

var User = require('./User');
var News = require('./News');

var Like = bookshelf.Model.extend({
  tableName: 'likes',
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

module.exports = bookshelf.model('Like',Like);
