exports.up = function(knex) {
 return knex.schema.createTable('users', table => {
   table.increments('id_user').primary();
   table.string('name').notNullable();
   table.string('email').unique().notNullable();
   table.string('password').notNullable();
  
   table
   .enum('position', ['Coordenacao', 'Preceptor'], {
       useNative: true,
       enumName: 'user_position_type'
   }
   )
   .notNullable()
   .defaultTo('Preceptor');
 })
};


exports.down = function(knex) {
 return knex.schema.dropTable('users');
};
