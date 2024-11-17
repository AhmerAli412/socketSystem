import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  score: number;
  walletAddress?: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  score: { type: Number, default: 0 },
  walletAddress: { type: String, unique: true },
});

export const User = mongoose.model<IUser>("User", UserSchema);
