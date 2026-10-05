import dotenv from "dotenv";

dotenv.config({ quiet: true });

const env = (key: string, defaultValue = ""): string => process.env[key] ?? defaultValue;

const envNumber = (key: string, defaultValue: number): number => {
  const raw = process.env[key];
  if (raw === undefined || raw === "") return defaultValue;
  const value = Number(raw);
  return Number.isFinite(value) ? value : defaultValue;
};

const envBoolean = (key: string, defaultValue: boolean): boolean => {
  const raw = process.env[key];
  if (raw === undefined || raw === "") return defaultValue;
  return raw.toLowerCase() === "true";
};

export { env, envNumber, envBoolean };
