import { Request, Response } from "express";
import { User } from "../models/user";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, walletAddress } = req.body;

    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      res.status(400).json({ success: false, message: "Invalid wallet address" });
      return;
    }
    const newUser = await User.create({ username, walletAddress });
    res.status(201).json({ success: true, data: newUser });
  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`,
      });
      return;
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPlayerWalletAddress = async (userId: string): Promise<string> => {
  const user = await User.findById(userId);
  if (!user || !user.walletAddress) {
    throw new Error(`Wallet address not found for user ID: ${userId}`);
  }
  return user.walletAddress;
};