import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
  sessionId: string;
  players: string[]; // List of user IDs
  startTime: Date;
  endTime: Date;
  active: boolean;
}

const SessionSchema: Schema = new Schema({
  sessionId: { type: String, required: true, unique: true },
  players: [{ type: Schema.Types.ObjectId, ref: "User" }],
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  active: { type: Boolean, default: true },
});

export const Session = mongoose.model<ISession>("Session", SessionSchema);
