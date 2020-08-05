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

Use sua configuração baseado no container que criou.

DATABASE_URL = postgres://postgres:fapeap@localhost:5433/projeto_fapeap
