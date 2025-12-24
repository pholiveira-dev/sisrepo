require("dotenv").config({ path: "./.env" });

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  // Perfil de desenvolvimento (mais usado localmente)
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5435,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: "./src/db/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./src/db/seeds",
    },
  },

  // Perfil de staging (geralmente um ambiente de testes pré-produção)
  staging: {
    client: "pg",
    connection: {
      database: "my_db_staging",
      user: "username_staging",
      password: "password_staging",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  // Perfil de produção (ambiente final e público)
  production: {
    client: "pg",
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
