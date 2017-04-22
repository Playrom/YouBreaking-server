var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var bookshelf = require('../config/bookshelf');

var News = require('./News');

var config = require('../config');

var Aggiunte = bookshelf.Model.extend({
  tableName: 'aggiuntivi',
  uuid: true,
  hasTimestamps: true,

  notizia : function(){
    return this.belongsTo('News','notizia_id');
  },

  virtuals: {
    url : function(){
      if(this.get('tipo').includes('PHOTO')){
        return config.URL + "/photos/" + this.get('valore');
      }
    }
  },

  hidden: ['created_at', 'updated_at'],

});

module.exports = bookshelf.model('Aggiunte',Aggiunte);
