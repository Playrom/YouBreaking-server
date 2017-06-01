var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var bookshelf = require('../config/bookshelf');
var path = require('path');
var fs = require('fs');

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
    },
    other_urls : function(){
      if(this.get('tipo').includes('PHOTO')){
        var dirPath = path.join(__dirname, '../public/photos/')

        var fileName = this.get('valore');
        if(fileName){
          var imageType = path.extname(fileName);
          var imageName = path.basename(fileName,imageType);

          var baseUrl = config.URL + "/photos/" + imageName + "-";
          var filePath = dirPath + imageName + "-";
          var urls = {
            small : fs.existsSync(filePath + "small" + imageType) ? baseUrl + "small" + imageType : null,
            medium : fs.existsSync(filePath + "medium" + imageType) ? baseUrl + "medium" + imageType : null,
            large : fs.existsSync(filePath + "large" + imageType) ? baseUrl + "large" + imageType : null,
            thumb : fs.existsSync(filePath + "thumb" + imageType) ? baseUrl + "thumb" + imageType : null
          }
          
          return urls;
        }
      }
    }
  },

  hidden: ['created_at', 'updated_at'],

});

module.exports = bookshelf.model('Aggiunte',Aggiunte);
