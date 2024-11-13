import { sql } from "./db";
import migrateRiskyLaunches from "./features/risky-launches/migration";

const migrations = [migrateRiskyLaunches];

for (const fn of migrations) {
  await fn(sql);
}

console.log(`Completed ${migrations.toLocaleString()} migrations`);

await sql.end({ timeout: 5 });
