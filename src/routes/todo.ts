import express from "express";
import Todo, { ITodo } from "../models/Todo";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Get all todos
router.get("/", authenticateToken, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: (req as any).user.userId });
    res.json(todos);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new todo
router.post("/", authenticateToken, async (req, res) => {
  const { title, description } = req.body;
  const userId = (req as any).user.userId;

  try {
    const newTodo = new Todo({ title, description, userId });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Update a todo
router.put("/:id", authenticateToken, async (req, res) => {
  const { title, description, completed } = req.body;
  const userId = (req as any).user.userId;

  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId },
      { title, description, completed },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json(updatedTodo);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a todo
router.delete("/:id", authenticateToken, async (req, res) => {
  const userId = (req as any).user.userId;

  try {
    const deletedTodo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
