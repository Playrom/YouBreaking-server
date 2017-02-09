exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('locations', function(table) {
      table.uuid('id').primary();
      table.string('longitude');
      table.string('latitude');
      table.timestamps();
      table.uuid('user_id').references('users.id');
    }),
    knex.schema.createTable('notificationTokens', function(table) {
      table.uuid('id').primary();
      table.string('token',64);
      table.timestamps();
      table.uuid('user_id').references('users.id');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('locations'),
    knex.schema.dropTable('notificationTokens')
  ])
};