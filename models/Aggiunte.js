var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var bookshelf = require('../config/bookshelf');

var News = require('./News');

var Aggiunte = bookshelf.Model.extend({
  tableName: 'aggiuntivi',
  uuid: true,
  hasTimestamps: true,

  notizia : function(){
    return this.belongsTo('News','notizia_id');
  },

      hidden: ['created_at', 'updated_at'],

});

module.exports = bookshelf.model('Aggiunte',Aggiunte);
