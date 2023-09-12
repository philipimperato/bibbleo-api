import { Dialect } from 'sequelize/types';

export default () => ({
  database: {
    dialect: 'postgres' as Dialect,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    autoLoadModels: true,
    synchronize: true,
  },
  e2edb: {
    dialect: 'postgres' as Dialect,
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: 'e2e@testdb',
    database: 'postgres',
    autoLoadModels: true,
    synchronize: true,
  },
});
