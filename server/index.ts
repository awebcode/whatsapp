import express from "express";
import http from "http";
import { initSocket } from "./modules/socket/handle.socket";
import {
  errorHandler,
  NotFoundExceptionMiddleware,
} from "./middlewares/errors-handle.middleware";
import config from "./config/index.config";
import morgan from "morgan";
import { loggerInstance } from "./config/logger.config";
import { envConfig } from "./config/env.config";
import mainRoutes from "./modules/index.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
const server = http.createServer(app);

/**
 * Global Necessary Middlewares
 */
app.use(express.static("public")); // for serving static files
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors(config.corsOptions)); //for allowing cross-origin requests
app.use(cookieParser()); // for parsing cookies | res.cookie

//* Use Helmet for security
app.use(config.helmet());

// Logging middleware morgan & winston
app.use(
  morgan("dev", { stream: { write: (message) => loggerInstance.info(message.trim()) } })
);

// Apply the rate limiting middleware to all requests.
app.use(config.rateLimit);

// Routes
app.use("/api/v1", mainRoutes);

// Init Socket
initSocket(server);

// Global Errors Handl Middleware
app.use(NotFoundExceptionMiddleware);
app.use(errorHandler);

server.listen(envConfig.port, () => {
  console.log(`Chat server is listening on  http://localhost:${envConfig.port}!`);
});
