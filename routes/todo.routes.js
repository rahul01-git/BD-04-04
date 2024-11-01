const router = require("express").Router();
const Todo = require("../models/Todo");
const User = require("../models/user");
const todoSchema = require("../schema/todo.schema");

router.post("/", async (req, res, next) => {
  try {
    const { error } = todoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        error: error.details[0].message,
      });
    }
    console.log(req);
    const { status } = req.body;

    const validStatuses = ["pending", "expired", "completed"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Error creating todo",
        error:
          "Status must be one of the following: pending, expired, completed.",
      });
    }

    const todo = await Todo.create({ userId: req.userId, ...req.body });
    res.status(201).json({
      message: "New Todo created successfully",
      data: todo,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const todos = await Todo.findAll({
      where: { userId: req.userId },
      include: {
        model: User,
        as: "user",
        attributes: ["id", "username", "email"],
      },
      order: [['id', 'ASC']]
    });

    res.status(200).json({
      message: "Todos fetched successfully",
      data: todos,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(req.userId);
    const todo = await Todo.findOne({
      where: { id, userId: req.userId },
      include: {
        model: User,
        as: "user",
        attributes: ["id", "username", "email"],
      },
    });
    if (!todo)
      return res
        .status(404)
        .json({ message: `Todo with id ${id} not found !!` });
    res.status(200).json({
      message: "Todos fetched successfully",
      data: todo,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({
      where: { id, userId: req.userId },
    });

    if (!todo)
      return res.status(404).json({ message: `Todo with id ${id} not found!` });

    await todo.update(req.body);

    res.status(200).json({
      message: "Todo updated successfully",
      data: todo,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({
      where: { id, userId: req.userId },
    });
    if (!todo)
      return res
        .status(404)
        .json({ message: `Todo with id ${id} not found !!` });

    await Todo.destroy({ where: { id } });
    res.status(200).json({
      message: "Todo deleted successfully",
      data: todo,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = { router };
