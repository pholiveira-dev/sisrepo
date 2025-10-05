exports.up = function(knex) {
  return knex.schema.createTable('schedules', table => {
    table.increments('id_schedule').primary();
    table.date('schedule_date').notNullable();
    table.enum('shift', ['Manhã', 'Tarde', 'Noite']).notNullable();
    table.integer('max_capacity').notNullable().default(30);

    table
    .integer('created_by_user_id')
    .unsigned()
    .notNullable()
    .references('id_user')
    .inTable('users');

    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('schedules');
};
