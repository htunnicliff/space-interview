import type { Sql } from "postgres";

export default async function (sql: Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS risky_launches (
      launch_id TEXT,
      crew_count INT NOT NULL,
      risk_type TEXT NOT NULL,
      PRIMARY KEY (launch_id)
    );
  `;
}
