import { ethers } from "ethers";
import APIClient from "../adapters/APIClient";

class GameService {
  static async proposeMove(move: string, step: number) {
    const result = await APIClient.writeController('requestMove', ethers.hexlify(ethers.toUtf8Bytes(move)), step);
    return result;
  }
  static async joinTeam(isBlack: boolean) {
    const result = await APIClient.writeController('register', isBlack);
    return result;
  }
}

export default GameService;