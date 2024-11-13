type Env = {
  NASA_API_KEY: string;
  POSTGRES_URL: string;
};

export function env(key: keyof Env): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable ${key}`);
  }

  return value;
}
