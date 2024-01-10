import { createClient } from "@supabase/supabase-js";
import fkcController from "@/app/abi/FKCController.json";
import { ethers } from "ethers";
import { recoverMessageAddress, verifyMessage } from "viem";
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const superUser = createClient(supabaseUrl, process.env.SUPABASE_KEY!);
const contract = new ethers.Contract(`0x${process.env.NEXT_PUBLIC_CONTRACT_FKCCONTROLLER}`, fkcController.abi as ethers.InterfaceAbi, ethers.getDefaultProvider('matic'));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get('gameId');
  let { data, error } = await supabase.from('messages')
    .select('*')
    .eq('game_id', gameId)
    .order('timestamp', { ascending: false })
    .limit(100);
  console.log(data, error);
  console.log(await supabase.getChannels());
  
  return Response.json({ data });
}

export async function POST(request: Request) {
  // get signature
  // verify user exists
  try {
    const json = await request.json();
    const { message, signature, address } = json;
    if (!message || !signature || !address || message.length < 2) {
      return new Response(null, { status: 403, statusText: "Missing message or signature" });
    }
    const verified = await verifyMessage({address, message, signature});
    const signer = await recoverMessageAddress({ message, signature});
    console.log(verified, signer);
    if (signer !== address || !verified) {
      return new Response(null, { status: 403, statusText: "Invalid signature" });
    }
    // confirm user is a player
    // registeredBlackPlayer, registeredWhitePlayer, currentToken

    const black = await contract.registeredBlackPlayer(address);
    const white = await contract.registeredWhitePlayer(address);
    const curr = await contract.currentToken();

    if (black !== curr && white !== curr) {
      return new Response(null, { status: 403, statusText: "Player not registered" });
    }
    const { error } = await superUser.from('messages').insert({ game_id: Number(curr), username: address, text: message, message_sig: signature });

    if (error) {
      return new Response(null, { status: 500, statusText: error.message });
    }

    return new Response();
  }
  catch (e: any) {
    return new Response(null, { status: 500, statusText: e});
  }
}