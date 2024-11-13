import postgres from "postgres";
import prexit from "prexit";
import { env } from "./env";

export const sql = postgres(env("POSTGRES_URL"));

prexit(async () => {
  await sql.end({ timeout: 5 });
});
