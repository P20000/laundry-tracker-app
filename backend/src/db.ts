import { createClient, Client } from '@libsql/client/http'; // Use the HTTP-specific client import
import 'dotenv/config'; 

// Ensure these environment variables are set in your backend/.env file
// If using the HTTP client, the URL *must* start with https:// or http://
let connectionString = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

// Fallback/Correction logic to ensure https protocol if libsql is provided
if (connectionString && connectionString.startsWith("libsql://")) {
    connectionString = connectionString.replace("libsql://", "https://");
}

// Initialize LibSQL Client (Turso) using the HTTP driver
const client: Client = createClient({
  url: connectionString || "file:./local.db",
  authToken: authToken,
});

// Export the raw LibSQL client for making queries
export { client };