exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('tokens', function(table) {
      table.increments();
      table.text('token','longtext');
      table.integer('user_id').unsigned().references('users.id');
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
