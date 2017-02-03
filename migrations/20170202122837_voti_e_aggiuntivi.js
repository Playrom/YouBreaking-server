exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('voti', function(table) {
      table.uuid('id').primary();
      table.uuid('user_id').references('users.id');
      table.uuid('notizia_id').references('notizie.id');
      table.enu('voto', ['UP', 'DOWN', 'MOD_UP','MOD_DOWN','EDITOR_UP','EDITOR_DOWN'])
      table.timestamps();
      table.unique(['user_id', 'notizia_id'])
    }),
    knex.schema.createTable('aggiuntivi', function(table) {
      table.uuid('id').primary();
      table.uuid('notizia_id').references('notizie.id');
      table.string('tipo');
      table.string('valore');
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('voti'),
    knex.schema.dropTable('aggiuntivi')
  ])
};
