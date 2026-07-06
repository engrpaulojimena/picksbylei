import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Disable Next.js fetch cache on the Neon HTTP driver so every DB query
// always hits the database and never returns stale cached results.
const sql = neon(process.env.DATABASE_URL!, {
  fetchOptions: { cache: "no-store" },
});
export const db = drizzle(sql, { schema });
