exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('users', function(table) {
      table.string('facebook_token');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('users', function(table) {
      table.dropColumn('facebook_token');
    })
  ])
};
