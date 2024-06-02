import express, { Request, Response } from "express";
import User, { IUser } from "../models/User";
import bcrypt from "bcryptjs";

const router = express.Router();

// Register a new user
router.post("/register", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ username, email, password });
    const savedUser = await newUser.save();

    const token = savedUser.generateAuthToken();
    res.status(201).json({ token });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// User login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = user.generateAuthToken();
    res.json({ token });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
