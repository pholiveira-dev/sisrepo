require("dotenv").config();

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./src/db/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./src/db/seeds",
    },
  },

  production: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./src/db/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./src/db/seeds",
    },
  },
};
