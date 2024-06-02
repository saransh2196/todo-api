import express, { Application, Request, Response } from "express";
import todoRoutes from "./routes/todo";
import userRoutes from "./routes/user";
// import { connectDB } from "./database";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app: Application = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
const mongoURI = `mongodb+srv://saransh2196:rOiI9ZtT3VNTqt2N@todo-jwt-api.vgkhbqd.mongodb.net/?retryWrites=true&w=majority&appName=todo-jwt-api`;

//mongodb connection
mongoose.connect(mongoURI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

//routes
app.use("/api/todos", todoRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Todo API!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
