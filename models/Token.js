var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var bookshelf = require('../config/bookshelf');

var User = require('./User');

var Token = bookshelf.Model.extend({
  tableName: 'tokens',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User);
  }
});

module.exports = Token;
