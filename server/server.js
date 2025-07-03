require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const passport = require("passport");
const xss = require("xss-clean");

require("./config/passport");
const helmetConfig = require("./config/helmet");
const errorHandler = require("./middleware/errorHandler");
const { sequelize } = require("./models");
const authRoutes = require("./routes/authRoutes");
const electionRoutes = require("./routes/electionRoutes");
const refreshRoute = require("./routes/refreshTokenRoute");
const timerRoutes = require("./routes/timerRoutes");
const logger = require("./utils/logger");

const port = process.env.PORT || 3001;
const app = express();

app.use(passport.initialize());
app.use(
  cors({
    origin: "http://localhost:3000", // https://demovotingapp.onrender.com/
    credentials: true,
  }),
);
app.use(helmet.contentSecurityPolicy(helmetConfig.contentSecurityPolicy));
app.use(xss());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/election", electionRoutes);
app.use("/timer", timerRoutes);
app.use("/token", refreshRoute);
app.use(errorHandler);

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connection successful");
    logger.info(`Server listening on port ${port}`);
  } catch (err) {
    logger.error("Failed to connect to database:", err);
    process.exit(1);
  }
});
