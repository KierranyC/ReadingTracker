// Connect to DB
import { config as dotenvConfig } from 'dotenv';
import pg from 'pg';

dotenvConfig();
const { Client } = pg;

const DB_URL =
  process.env.DATABASE_URL

let client;

// Check if running in Heroku environment
if (DB_URL) {
  // Heroku environment

  client = new Client({
    connectionString: DB_URL,
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  });
} else {
  // Local environment
  client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'kizpc',
    database: 'readingtrackerapp',
  });
}



export default client;