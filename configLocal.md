# Arquivo ormconfig.js

module.exports = {
type: 'postgres',
url: process.env.DATABASE_URL,
entities: ['src/models/**/*.ts'],
migrations: ['src/database/migrations/**/*.ts'],
cli: {
migrationsDir: './src/database/migrations',
},
};

## Arquivo .env

DATABASE_URL = postgres://postgres:fapeap@localhost:5433/projeto_fapeap
