var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var bookshelf = require('../config/bookshelf');

var User = require('./User');
var Aggiunte = require('./Aggiunte');
var Voto = require('./Voto');
var Evento = require('./Evento');

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


  voti : function(){
    return this.hasMany(Voto,'notizia_id');
  },

  virtuals: {
    score : function(){
      var score = 0;
      var voti = this.related('voti').toJSON();
      if(voti){
        for(var i = 0 ; i < voti.length ; i++){
          switch (voti[i]["voto"]) {
            case "UP":
              score = score + 1 ;
              break;
            case "AUTHOR_UP":
              score = score + 2 ;
              break;
            case "EDITOR_UP":
              score = score + 3 ;
              break;
            case "MOD_UP":
              score = score + 5 ;
              break;
            case "ADMIN_UP":
              score = score + 5 ;
              break;
            case "DOWN":
              score = score - 1 ;
              break;
            case "AUTHOR_DOWN":
              score = score - 2 ;
              break;
            case "EDITOR_DOWN":
              score = score - 3 ;
              break;
            case "MOD_DOWN":
              score = score - 5 ;
              break;
            case "ADMIN_DOWN":
              score = score - 5 ;
              break;
            default:
              break;
          }
        }
      }
      return score;
    }
  },

  hidden: ['event_id'],

});

module.exports = bookshelf.model('News',News);
