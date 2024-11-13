import {
  addDays,
  addWeeks,
  eachWeekOfInterval,
  formatISO,
  interval,
  min,
  subDays,
} from "date-fns";
import ky from "ky";
import PQueue from "p-queue";
import { env } from "../env";

// ---- Types

type Feed = {
  element_count: number;
  near_earth_objects: Record<string, NearEarthObject[]>;
};

export type NearEarthObject = {
  id: string;
  is_potentially_hazardous_asteroid: boolean;
};

// ---- API

const nasa = ky.create({
  prefixUrl: "https://api.nasa.gov/neo/rest/v1",
  searchParams: {
    api_key: env("NASA_API_KEY"),
  },
});

// ---- Operations

export async function getNearEarthObjects(
  start: Date,
  end: Date
): Promise<Record<string, NearEarthObject[]>> {
  const feed: Feed = await nasa
    .get("feed", {
      searchParams: {
        start_date: formatISO(start, { representation: "date" }),
        end_date: formatISO(addDays(end, 1), { representation: "date" }),
      },
    })
    .json();

  return feed.near_earth_objects;
}

export async function getHazardousAsteroidsDuringInterval(
  start: Date,
  end: Date
) {
  const range = interval(start, end);

  // Get the start and end dates of each week
  const weekStartDates = eachWeekOfInterval(range);
  const weeks = weekStartDates.map((weekStart) => {
    const nextWeek = addWeeks(weekStart, 1);
    const weekEnd = subDays(nextWeek, 1);
    return [weekStart, weekEnd] as const;
  });

  // Fetch only N requests at once
  const queue = new PQueue({ concurrency: 10 });

  const results = new Map<string, NearEarthObject[]>();

  // Fetch each week of data
  for (const [weekStart, weekEnd] of weeks) {
    queue.add(async () => {
      const objects = await getNearEarthObjects(weekStart, weekEnd);

      // Only save hazardous asteroids
      for (const [key, items] of Object.entries(objects)) {
        results.set(
          key,
          items.filter((item) => item.is_potentially_hazardous_asteroid)
        );
      }
    });
  }

  // Wait until queue is empty
  await queue.onEmpty();

  return results;
}
