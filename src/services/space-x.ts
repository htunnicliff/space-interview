import { formatISO, isAfter, isBefore, parseISO } from "date-fns";
import ky from "ky";

// ---- Types

type Core = {
  core: string;
  reused: boolean;
};

type Launch = {
  id: string;
  crew: string[];
  cores: Core[];
  date_utc: string;
};

// ---- API

const spaceX = ky.create({
  prefixUrl: "https://api.spacexdata.com/v4",
});

// ---- Operations

export async function getLaunches() {
  const launches: Launch[] = await spaceX.get("launches").json();

  let start: Date | undefined;
  let end: Date | undefined;

  for (const launch of launches) {
    const date = parseISO(launch.date_utc);
    if (start === undefined || isBefore(date, start)) {
      start = date;
    }
    if (end === undefined || isAfter(date, end)) {
      end = date;
    }
  }

  if (start === undefined || end === undefined) {
    throw new Error("Invalid launch data");
  }

  return {
    launches,
    start,
    end,
  };
}
