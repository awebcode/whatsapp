import express from "express";
import http from "http";
import { initSocket } from "./modules/socket/handle.socket";
import {
  errorHandler,
  NotFoundExceptionMiddleware,
} from "./middlewares/errors-handle.middleware";
import { envConfig } from "./config/env.config";
import mainRoutes from "./modules/index.routes";
import { setupMiddleware } from "./middlewares/setup-middlewares"; // Import the middleware setup

const app = express();
const server = http.createServer(app);

// Global necessary middlewares
setupMiddleware(app);

// Routes
app.use("/api/v1", mainRoutes);

// Initializing Socket
initSocket(server);

// Global Errors Handling Middleware
app.use(NotFoundExceptionMiddleware);
app.use(errorHandler);

server.listen(envConfig.port, () => {
  console.log(`Chat server is listening on http://localhost:${envConfig.port}!`);
});
