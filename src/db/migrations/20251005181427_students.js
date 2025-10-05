exports.up = function(knex) {
 return knex.schema.createTable('students', table => {
   table.increments('id_student').primary();
   table.string('name').notNullable();
   table.string('email').unique().notNullable();
   table.string('rgm', 15).unique().notNullable();
   table.enum('current_semester', ['7 Semestre', '8 Semestre', '7/8 Semestre'], {
       useNative: true,
       enumName: 'current_semester_option'
   })
   .notNullable();


   table.string('access_code', 4).notNullable();
  
   table
   .integer('created_by_user_id')
   .unsigned()
   .notNullable()
   .references('id_user')
   .inTable('users')
   .onDelete('RESTRICT')
   .onUpdate('CASCADE');

   table
   .integer('updated_by_user_id')
   .unsigned()
   .references('id_user')
   .inTable('users')
   .onDelete('RESTRICT')
   .onUpdate('CASCADE');

   // timestamps para updated/created by_user_id

   table.timestamps(true, true);
 })

};

exports.down = function(knex) {
 return knex.schema.dropTable('students')
}
