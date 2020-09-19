import knex from "knex"

export let DB: knex<any, unknown[]> | null = null;
export const initDb = async () => {
  DB = knex({
    client: process.env.DB_DIALECT,
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USERNAME,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_NAME
    }
  });
  return DB
}

export default DB;