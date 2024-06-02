import request from "supertest";
import mongoose from "mongoose";
import app from "../server";

describe("Server Test", () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return "Hello, Todo API!" for the root route', async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello, Todo API!");
  });

  it("should connect to MongoDB", async () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});
