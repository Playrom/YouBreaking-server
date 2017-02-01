exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('users', function(table) {
      table.integer('level').defaultTo(1);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('users', function(table) {
      table.dropColumn('level');
    })
  ])
};
