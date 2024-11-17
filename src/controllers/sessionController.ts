import { Request, Response } from "express";
import { Session } from "../models/session";
import { User } from "../models/user"; // Ensure User is used properly

export const createSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId, startTime, endTime } = req.body;
    const newSession = await Session.create({ sessionId, startTime, endTime });
    res.status(201).json({ success: true, data: newSession });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const joinSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId, userId } = req.body;

    // Ensure session exists
    const session = await Session.findOne({ sessionId });
    if (!session) {
      res.status(404).json({ success: false, message: "Session not found" });
      return;
    }

    // Push user into session players
    session.players.push(userId);
    await session.save();

    res.status(200).json({ success: true, message: "User added to session" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
