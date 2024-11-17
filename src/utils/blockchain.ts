import { ethers } from "ethers";
import dotenv from "dotenv";
import { getPlayerWalletAddress } from "../controllers/userController";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const privateKey = process.env.PRIVATE_KEY as string;
const wallet = new ethers.Wallet(privateKey, provider);
const contractAddress = process.env.CONTRACT_ADDRESS as string;
const abi = [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [{ "name": "", "type": "string" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }],
      "name": "transfer",
      "outputs": [{ "name": "success", "type": "bool" }],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [{ "name": "", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [{ "name": "_owner", "type": "address" }],
      "name": "balanceOf",
      "outputs": [{ "name": "balance", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        { "name": "_from", "type": "address" },
        { "name": "_to", "type": "address" },
        { "name": "_value", "type": "uint256" }
      ],
      "name": "transferFrom",
      "outputs": [{ "name": "success", "type": "bool" }],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }],
      "name": "approve",
      "outputs": [{ "name": "success", "type": "bool" }],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }],
      "name": "allowance",
      "outputs": [{ "name": "remaining", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "name": "_initialSupply", "type": "uint256" }],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "name": "owner", "type": "address" },
        { "indexed": true, "name": "spender", "type": "address" },
        { "indexed": false, "name": "value", "type": "uint256" }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "name": "from", "type": "address" },
        { "indexed": true, "name": "to", "type": "address" },
        { "indexed": false, "name": "value", "type": "uint256" }
      ],
      "name": "Transfer",
      "type": "event"
    }
  ]
  
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  export const rewardPlayer = async (userId: string) => {
    try {
      const playerAddress = await getPlayerWalletAddress(userId); 
      const amount = ethers.parseUnits("10", 18); 
      const tx = await contract.transfer(playerAddress, amount);
      const receipt = await tx.wait();
      console.log("Reward transaction successful:", receipt);
      return receipt;
    } catch (error) {
      console.error("Error rewarding player:", error);
      throw new Error("Failed to reward the player.");
    }
  };