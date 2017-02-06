exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('events', function(table) {
      table.uuid('id').primary();
      table.string('name');
      table.timestamps();
    }),

    knex.schema.alterTable('notizie', function(table) {
      table.uuid('event_id').references('events.id');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('events'),
    knex.schema.alterTable('notizie', function(table) {
      table.dropColumn('event_id');
    })
  ])
};
