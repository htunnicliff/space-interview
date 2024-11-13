import { sql } from "../../db";
import type { RiskyLaunch } from "./schema";

export async function saveRiskyLaunches(data: RiskyLaunch[]) {
  await sql`
    INSERT INTO risky_launches ${sql(data, [
      "crew_count",
      "launch_id",
      "risk_type",
    ])} ON CONFLICT DO NOTHING;
  `;
}
