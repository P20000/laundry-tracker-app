import { createClient } from '@libsql/client/http'; // Use specific HTTP import
import 'dotenv/config'; 

let url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
    console.error("❌ TURSO_DATABASE_URL is missing!");
    // Fallback to local if absolutely necessary, but this will fail on Render without a file volume
    url = "file:./local.db";
}

// FORCE HTTPS: If the user pasted 'libsql://', convert it to 'https://'
// This fixes the "Unexpected status code 400" error.
if (url.startsWith("libsql://")) {
    url = url.replace("libsql://", "https://");
}

console.log(`🔌 Connecting to Turso at: ${url}`);

const client = createClient({
  url: url,
  authToken: authToken,
});

export { client };