var config = require('../knexfile');
var knex = require('knex')(config);
var bookshelf = require('bookshelf')(knex);

bookshelf.plugin('virtuals');
bookshelf.plugin('visibility');
bookshelf.plugin(require('bookshelf-uuid'))
bookshelf.plugin('registry')

knex.migrate.latest();

module.exports = bookshelf;
