// Importa o dotenv para carregar variáveis de ambiente
require('dotenv').config({ path: './.env' }); 

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  // Perfil de desenvolvimento (mais usado localmente)
  development: {
    client: 'pg', // <<-- Alterado para 'pg' (PostgreSQL)
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5435,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME 
    },
    migrations: {
      directory: './src/db/migrations', // Ajuste este caminho para a sua pasta de migrations
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './src/db/seeds' // Ajuste este caminho para a sua pasta de seeds (dados iniciais)
    }
  },

  // Perfil de staging (geralmente um ambiente de testes pré-produção)
  staging: {
    client: 'pg',
    connection: {
      database: 'my_db_staging', // Altere este nome de banco de dados
      user:     'username_staging',  // Altere este usuário
      password: 'password_staging' // Altere esta senha
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  // Perfil de produção (ambiente final e público)
  production: {
    client: 'pg',
    connection: {
      database: 'my_db_production', // Altere este nome de banco de dados
      user:     'username_prod',  // Altere este usuário
      password: 'password_prod' // Altere esta senha
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};