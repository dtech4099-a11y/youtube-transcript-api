import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: undefined,
  redact: {
    paths: ["req.headers.authorization", "req.headers.x-api-key", "*.apiKey", "*.token"],
    censor: "[redacted]"
  },
  timestamp: pino.stdTimeFunctions.isoTime
});

export type AppLogger = typeof logger;
