const router = require("express").Router();
const Todo = require("../models/Todo");
const todoSchema = require("../validation/todo.validation");

router.post("/", async (req, res, next) => {
  try {
    const { error, value } = todoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        error: error.details[0].message,
      });
    }
    const { title, expiryDate, status } = req.body;

    const validStatuses = ["pending", "expired", "completed"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Error creating todo",
        error:
          "Status must be one of the following: pending, expired, completed.",
      });
    }

    const todo = await Todo.create({ title, expiryDate, status });
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
    const todos = await Todo.findAll();
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
    const todo = await Todo.findByPk(id);
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
    const todo = await Todo.findByPk(id);

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
    const todo = await Todo.findByPk(id);
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
