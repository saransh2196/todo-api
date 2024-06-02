import request from "supertest";
import mongoose from "mongoose";
import app from "../server";
import User from "../models/User";

describe("User Routes", () => {
  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  it("should register a new user", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
  });

  it("should not register a user with an existing email", async () => {
    const user = new User({
      username: "existinguser",
      email: "existing@example.com",
      password: "password123",
    });
    await user.save();

    const response = await request(app)
      .post("/api/users/register")
      .send({
        username: "newuser",
        email: "existing@example.com",
        password: "password456",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "User already exists");
  });

  it("should login with correct credentials", async () => {
    const user = new User({
      username: "loginuser",
      email: "login@example.com",
      password: "password123",
    });
    await user.save();

    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "login@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should not login with incorrect credentials", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "wrong@example.com", password: "wrongpassword" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid credentials");
  });
});
