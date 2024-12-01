import { helmetConfig } from "./helmet.config";
import { loggerInstance } from "./logger.config";
import { rateLimitConfig } from "./rate-limit.config";

// Exporting a configuration object
const config = {
  helmet: helmetConfig,
  rateLimit: rateLimitConfig,
  logger: loggerInstance,
  corsOptions: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
};

export default config;
