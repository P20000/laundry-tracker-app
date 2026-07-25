import { createClient } from '@libsql/client';
import 'dotenv/config'; 

let url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
    console.error("❌ TURSO_DATABASE_URL is missing!");
    // This will cause a crash, which is better than a silent failure
    throw new Error("Database URL is not defined");
}

// 1. Use the URL protocol exactly as provided in the environment variables. 
// Using libsql:// or wss:// will allow persistent WebSocket connections, dramatically reducing latency.

console.log(`🔌 Connecting to Turso...`);

// 2. Create Client with Explicit HTTP Configuration
// We use the generic createClient but pass the https URL which forces HTTP mode
const client = createClient({
  url: url,
  authToken: authToken,
});

export { client };