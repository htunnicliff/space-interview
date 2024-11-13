import { sql } from "./db";
import { getRiskyLaunches } from "./features/risky-launches/get-risks";
import { saveRiskyLaunches } from "./features/risky-launches/save-risks";

// Load risky launches
const riskyLaunches = await getRiskyLaunches();

// Persist launches to database
await saveRiskyLaunches(riskyLaunches);

await sql.end();
