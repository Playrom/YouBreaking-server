exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('notizie', function(table) {
      table.uuid('id').primary();
      table.string('title',1000);
      table.text('text','longtext');
      table.timestamps();
      table.uuid('user_id').references('users.id');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('notizie')
  ])
};
