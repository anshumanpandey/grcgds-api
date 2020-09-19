import { Sequelize } from "sequelize"

let sequelize: null | Sequelize = null;
export const initDb = async () => {
  console.log(`using ${process.env.DB_DIALECT} dialect`)
  sequelize = new Sequelize(process.env.DB_NAME || '', process.env.DB_USERNAME || '', process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT as "postgres" || 'postgres'
  });
}

export default sequelize;