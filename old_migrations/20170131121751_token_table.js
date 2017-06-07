exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('tokens', function(table) {
      table.uuid('id');
      table.text('token','longtext');
      table.uuid('user_id').references('users.id');
      table.dateTime('exp');
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('tokens')
  ])
};
