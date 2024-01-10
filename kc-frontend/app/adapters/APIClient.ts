import { Abi, Address, ReadContractParameters, createPublicClient, http, webSocket } from "viem";
import { polygon } from "wagmi/chains";
import { configuration } from "../common/config";
import fkcController from '@/app/abi/FKCController.json';
import fkcGame from '@/app/abi/FKCGame.json';
import { waitForTransaction, writeContract, prepareWriteContract } from '@wagmi/core';
import { ethers } from "ethers";

export const client = createPublicClient({
  chain: polygon,
  transport: http()
});

export const wsClient = createPublicClient({
  chain: polygon,
  // transport: webSocket(polygon.rpcUrls.alchemy.webSocket[0])
  transport: http() // setup the websocket?
});

type EventArgs = {
  from?: string,
  to?: string,
  eventName?: string,
  block?: number
}

class Client {
  address: Address;
  abi: Abi;
  contract: ethers.Contract

  constructor(address: string, abi: Abi) {
    this.address = `0x${address}`;
    this.abi = abi;
    this.contract = new ethers.Contract(this.address, this.abi as ethers.InterfaceAbi, new ethers.JsonRpcProvider(polygon.rpcUrls.public.http[0]));
  }
  config(fn: string, args: Array<any>): ReadContractParameters<typeof this.abi> {
    console.log(args);
    return {
      functionName: fn,
      args: args,
      abi: this.abi,
      address: this.address
    }
  }
  async read(fn: string, args: Array<any>) {
    return await client.readContract(this.config(fn, args));
  }
  async watch(eventName: string, listener: any) {
    return wsClient.watchContractEvent({
      eventName,
      abi: this.abi,
      address: this.address,
      onLogs: listener
    })
  }
  async write(fn: string, args: Array<any>) {
    const config = await prepareWriteContract(this.config(fn, args));
    const result = await writeContract(config);
    const rs = await waitForTransaction(result);
    return rs;
  }
  async findEvents(args: EventArgs) {
    // console.log(args);
    // return await client.getContractEvents({
    //   abi: this.abi,
    //   address: this.address,
    //   eventName: args.eventName,
    //   args: {
    //     from: args.from,
    //     to: args.to
    //   },
    //   fromBlock: BigInt(50417984),
    //   toBlock: BigInt(50418498)
    // })
    // return this.contract.queryFilter(args.eventName!, 50506556, 50506558)
    return [];
  }
}

class ApiClient {
  gameClient: Client;
  controllerClient: Client;

  constructor() {
    this.gameClient = new Client(`${configuration.fkcgame}`, fkcGame.abi as Abi);
    this.controllerClient = new Client(`${configuration.fkccontroller}`, fkcController.abi as Abi);
  }
  async checkNetwork() {

  }
  async readGame(fn: string, ...args: Array<any>) {
    this.checkNetwork();
    console.log(fn, args);
    return this.gameClient.read(fn, args);
  }
  async writeGame(fn: string, ...args: Array<any>) {
    this.checkNetwork();
    return this.gameClient.write(fn, args);
  }
  async readController(fn: string, ...args: Array<any>) {
    this.checkNetwork();
    return this.controllerClient.read(fn, args);
  }
  async writeController(fn: string, ...args: Array<any>) {
    this.checkNetwork();
    return this.controllerClient.write(fn, args);
  }
  async listenController(eventName: string, listener: any) {
    return this.controllerClient.watch(eventName, listener);
  }
  listenGame(eventName: string, listener: any) {
    return this.gameClient.watch(eventName, listener);
  }
  async getContractEventsController(gameId: number) {
    // return this.controllerClient.findEvents(args);
    const res = await fetch('/api/chat?gameId=' + gameId);
    const json = await res.json();
    console.log(json);
  }
  async getContractEventsGame(args: EventArgs) {
    return this.gameClient.findEvents(args);
  }
}

export default new ApiClient();