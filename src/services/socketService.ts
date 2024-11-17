import { Server, Socket } from "socket.io";
import { logger } from "../utils/logger";
import { rewardPlayer } from "../utils/blockchain";

interface PlayerData {
  userId: string;
  points: number;
}

const sessions: Map<string, PlayerData[]> = new Map();

export const setupSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    logger.info("Client connected", { socketId: socket.id });

    socket.on("join-session", ({ sessionId, userId }) => {
      logger.info(`User ${userId} joined session ${sessionId}`);
      if (!sessions.has(sessionId)) {
        sessions.set(sessionId, []);
      }
      const players = sessions.get(sessionId) || [];
      players.push({ userId, points: 0 });
      sessions.set(sessionId, players);
    });

    socket.on("update-points", ({ sessionId, userId, points }) => {
      const players = sessions.get(sessionId);
      if (!players) return;
      const player = players.find((p) => p.userId === userId);
      if (player) {
        player.points += points;
        logger.info(`User ${userId} updated points in session ${sessionId}`);
    
        // brodcasting points to playwrs
        io.to(sessionId).emit("points-updated", { userId, points: player.points });
      }
    });
    

    socket.on("end-session", async (sessionId) => {
      const players = sessions.get(sessionId);
      if (!players) return;
      const topPlayer = players.reduce((prev, curr) => (prev.points > curr.points ? prev : curr));
    
      logger.info(`Top player in session ${sessionId}:`, { userId: topPlayer.userId });
    
     
      try {
        const rewardTx = await rewardPlayer(topPlayer.userId);
        io.to(sessionId).emit("session-ended", { topPlayer, rewardTx });
        logger.info(`Reward transaction successful: ${rewardTx.hash}`);
      } catch (error) {
        logger.error("Failed to reward top player:", { error });
      }
    
      sessions.delete(sessionId);
    });

    socket.on("disconnect", () => {
      logger.info("Client disconnected", { socketId: socket.id });
    });
  });
};
