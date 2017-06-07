var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var bookshelf = require('../config/bookshelf');
var path = require('path');
var fs = require('fs');

var User = require('./User');
var Aggiunte = require('./Aggiunte');
var Like = require('./Like');
var Evento = require('./Evento');

var config = require('../config');

var News = bookshelf.Model.extend({
  tableName: 'notizie',
  uuid: true,
  hasTimestamps: true,

  user: function(){
    return this.belongsTo('User','user_id');
  },

  evento: function () {
    return this.belongsTo('Evento', 'event_id');
  },

  aggiuntivi : function(){
    return this.hasMany('Aggiunte','notizia_id');
  },

  links: function () {
    return this.aggiuntivi().query('where', 'tipo', 'LINK');
  },


  likes : function(){
    return this.hasMany(Like,'notizia_id');
  },

  userLike : function(){
    return this.hasOne(Like,'notizia_id');
  },

  

  virtuals: {
    featured_photo : function(){
      var aggiuntivi = this.related('aggiuntivi').toJSON();
      var featured_photo = null
      aggiuntivi.map(function(item){
        if(item.tipo == "FEATURED_PHOTO"){featured_photo =  item.valore;}
      })
      if(featured_photo){
        var dirPath = path.join(__dirname, '../public/photos/')

        var fileName = featured_photo;
        if(fileName){
          var imageType = path.extname(fileName);
          var imageName = path.basename(fileName,imageType);

          var baseUrl = config.URL + "/photos/" + imageName + "-";
          var filePath = dirPath + imageName + "-";
          var urls = {
            small : fs.existsSync(filePath + "small" + imageType) ? baseUrl + "small" + imageType : null,
            medium : fs.existsSync(filePath + "medium" + imageType) ? baseUrl + "medium" + imageType : null,
            large : fs.existsSync(filePath + "large" + imageType) ? baseUrl + "large" + imageType : null,
            thumb : fs.existsSync(filePath + "thumb" + imageType) ? baseUrl + "thumb" + imageType : null,
            original : config.URL + "/photos/" + featured_photo
          }
          
          return urls;
        }
      }
  },

    location : function(){
      var aggiuntivi = this.related('aggiuntivi').toJSON();
      var location = {}
      aggiuntivi.map(function(item){
        if(item.tipo.includes("LOCATION")){location[item.tipo.replace("LOCATION_","").toLowerCase()] =  item.valore;}
      })
      if(Object.keys(location).length > 0){return location;}
    },

    news_url : function(){
      return config.URL + "/news/" + this.id;
    }
  },

  hidden: ['event_id'],

  toJSON: function(options = {}){
    var json = bookshelf.Model.prototype.toJSON.apply(this, options);
    if(options.essential){
      return {
        id:json.id,
        news_url:json.news_url,
        created_at:json.created_at,
        updated_at:json.updated_at,
        user_id:json.user_id,
        title:json.title,
        description:json.text.slice(0,200),
        userLike:json.userLike
        
        /*featured_photo:json.featured_photo,
        location:json.location*/
      }
    }

    return json;
  }

},{
  userLike : function(user_id){
    return this.likes().query('where', 'user_id', 'user_id');
  },
});

module.exports = bookshelf.model('News',News);
