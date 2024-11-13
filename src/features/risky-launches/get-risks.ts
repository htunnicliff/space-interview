import { formatISO } from "date-fns";
import { getHazardousAsteroidsDuringInterval } from "../../services/nasa";
import { getLaunches } from "../../services/space-x";
import type { RiskyLaunch } from "./schema";

export async function getRiskyLaunches() {
  // Load launches
  const { launches, start, end } = await getLaunches();

  // Load hazerdous asteroids
  const asteroids = await getHazardousAsteroidsDuringInterval(start, end);
  const hazardousDates = new Set(asteroids.keys());

  // Identify risks
  const launchesWithRisk = launches.flatMap((launch): RiskyLaunch[] => {
    const id = launch.id;
    const crewCount = launch.crew.length;

    // Crew with reusable cores
    if (crewCount > 0 && launch.cores.some((core) => core.reused)) {
      return [
        {
          launch_id: id,
          crew_count: crewCount,
          risk_type: "crew_with_reusable_cores",
        },
      ];
    }

    // Asteroid
    const launchDate = formatISO(launch.date_utc, { representation: "date" });
    if (hazardousDates.has(launchDate)) {
      return [
        {
          launch_id: id,
          crew_count: crewCount,
          risk_type: "asteroid",
        },
      ];
    }

    // Not risky
    return [];
  });

  return launchesWithRisk;
}
