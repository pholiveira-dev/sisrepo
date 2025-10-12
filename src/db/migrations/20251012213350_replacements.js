exports.up = function(knex) {
  return knex.schema.createTable('replacements', table => {
    table.increments('id_replacement').primary();

    table.integer('student_id')
    .unsigned()
    .notNullable()
    .references('id_student')
    .inTable('students');

    table.integer('schedule_id')
    .unsigned()
    .notNullable()
    .references('id_schedule')
    .inTable('schedules');

    table.enum('justification', ['Escala 12x36', 'Atestado', 'Matricula Tardia', 'Autorização do Professor']).notNullable();
    table.boolean('is_present').notNullable().defaultTo(false);

    table.integer('preceptor_add_by')
    .unsigned()
    .notNullable()
    .references('id_user')
    .inTable('users');

    table.dateTime('schedule_at').notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('replacements');
};
