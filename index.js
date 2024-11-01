const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cron = require("node-cron");
const { router: todoRoutes } = require("./routes/todo.routes");
const { router: authRoutes } = require("./routes/auth.routes");
const { Database } = require("./config/instance");
const Todo = require("./models/Todo");
const { Op } = require("sequelize");
const { verifyToken } = require("./middlewares/authMiddleware");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: "Too many request, please try again later.",
});

app.use(morgan("dev"));
app.use(express.json());
app.use(limiter);

cron.schedule("*/30 * * * *", async () => {
  try {
    const [updatedCount] = await Todo.update(
      {
        status: "expired",
      },
      {
        where: {
          expiryDate: {
            [Op.lt]: new Date(),
          },
          status: "pending",
        },
      }
    );
    console.log(`${updatedCount} todo(s) has expired !!`);
  } catch (error) {
    console.error("Error updating expired todos:", error);
  }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Server Error",
    },
  });
});

app.get("/", (req, res) => {
  res.send("hola amigo");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/todo", verifyToken, todoRoutes);

app.use("/*", (req, res) => {
  res.status(404).json({ message: "route not found !!" });
});

app.listen(PORT, async () => {
  await Database.connection();
  console.log("server spinning on port", PORT);
});
