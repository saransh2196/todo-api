import request from "supertest";
import mongoose from "mongoose";
import app from "../server";
import Todo from "../models/Todo";
import User from "../models/User";

describe("Todo Routes", () => {
  let token: string;
  let userId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    const user = new User({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });
    await user.save();
    userId = user.id.toString();
    token = user.generateAuthToken();
  });

  afterAll(async () => {
    await Todo.deleteMany({});
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  it("should create a new todo", async () => {
    const response = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Todo", description: "This is a test todo" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("title", "Test Todo");
    expect(response.body).toHaveProperty("description", "This is a test todo");
    expect(response.body).toHaveProperty("userId", userId);
  });

  it("should get all todos for the authenticated user", async () => {
    const response = await request(app)
      .get("/api/todos")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should update a todo", async () => {
    const todo = new Todo({
      title: "Test Todo",
      description: "This is a test todo",
      userId,
    });
    await todo.save();

    const response = await request(app)
      .put(`/api/todos/${todo._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Todo",
        description: "This is an updated todo",
        completed: true,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("title", "Updated Todo");
    expect(response.body).toHaveProperty(
      "description",
      "This is an updated todo"
    );
    expect(response.body).toHaveProperty("completed", true);
  });

  it("should delete a todo", async () => {
    const todo = new Todo({
      title: "Test Todo",
      description: "This is a test todo",
      userId,
    });
    await todo.save();

    const response = await request(app)
      .delete(`/api/todos/${todo._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Todo deleted successfully"
    );
  });
});
