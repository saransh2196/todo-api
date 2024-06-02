import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  generateAuthToken: () => string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(String(this.password), salt);
  next();
});

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { userId: this._id },
    process.env.JWT_SECRET || "your_secret_key"
  );
  return token;
};

export default mongoose.model<IUser>("User", UserSchema);
