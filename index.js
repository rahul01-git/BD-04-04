const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cron = require("node-cron");
const { router: todoRoutes } = require("./routes/todo.routes");
const { router: authRoutes } = require("./routes/auth.routes");
const { Database } = require("./config/instance");
const User = require("./models/user");
const Todo = require("./models/todo");
const { Op } = require("sequelize");
const { verifyToken } = require("./middlewares/authMiddleware");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(morgan("dev"));
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: "Too many requests, please try again later.",
  })
);

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  socket.on("identify", async (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} will be receiving notifications now!`);

    try {
      const user = await User.findByPk(userId);
      if (user) {
        const recentExpiredTasks = await Todo.findAll({
          where: {
            userId,
            status: "expired",
            updatedAt: { [Op.gt]: user.lastLogin },
          },
        });

        recentExpiredTasks.forEach((task) => {
          socket.emit("notification", {
            taskId: task.id,
            message: `Your task "${task.title}" has expired`,
          });
        });

        await user.update({ lastLogin: new Date() });
      }
    } catch (error) {
      console.error("Error fetching missed notifications:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

cron.schedule("* * * * *", async () => {
  try {
    const expiredTodos = await Todo.findAll({
      where: {
        expiryDate: {
          [Op.lt]: new Date(),
        },
        status: "pending",
      },
    });

    if (expiredTodos.length > 0) {
      await Todo.update(
        { status: "expired" },
        { where: { id: expiredTodos.map((todo) => todo.id) } }
      );

      console.log(`${expiredTodos.length} todo(s) were expired !!`);

      expiredTodos.forEach((todo) => {
        const roomId = `user-${todo.userId}`;
        io.to(roomId).emit("notification", {
          taskId: todo.id,
          message: `Your task "${todo.title}" has expired`,
        });
      });
    } else {
      console.log(`No todos expired at ${new Date()}`);
    }
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

server.listen(PORT, async () => {
  await Database.connect();
  console.log("server spinning on port", PORT);
});
