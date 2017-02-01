exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('notizie', function(table) {
      table.uuid('id');
      table.string('title');
      table.text('text','longtext');
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('notizie')
  ])
};
