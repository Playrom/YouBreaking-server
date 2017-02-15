var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var bookshelf = require('../config/bookshelf');

var User = require('./User');

var NotificationToken = bookshelf.Model.extend({
  tableName: 'notificationTokens',
  uuid: true,
  hasTimestamps: true,
  user: function() {
    return this.belongsTo('User');
  }
});

module.exports = bookshelf.model('NotificationToken',NotificationToken);
