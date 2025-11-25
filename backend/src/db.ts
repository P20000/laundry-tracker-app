import { createClient, Client } from '@libsql/client';
import 'dotenv/config'; 

// Ensure these environment variables are set in your backend/.env file
const connectionString = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

// Initialize LibSQL Client (Turso)
const client: Client = createClient({
  url: connectionString || "file:./local.db",
  authToken: authToken,
});

// Export the raw LibSQL client for making queries
export { client };