import { createClient } from "@supabase/supabase-js";
import APIClient from "../adapters/APIClient";
import { configuration } from "../common/config";

const supabaseUrl = configuration.supabaseUrl;
const supabaseKey = configuration.supabaseKey;
// const instance = createClient(supabaseUrl, supabaseKey);

// instance.channel('kings-council-message-insert-channel')
//   .on(
//     'postgres_changes',
//     { event: 'INSERT', schema: 'public', table: 'messages' },
//     (payload) => {
//       console.log('payload received', payload);
//       listeners.map(e=>e(payload));
//     }
//   )
//   .subscribe();

const listeners: Array<(payload: any) => void> = [];

class GlobalChatState {
  static async loadGlobalChat(gameId: number) {
    const currentState = await APIClient.getContractEventsController(gameId);
    console.log(currentState);
    return currentState;
  }
  static async listenForGlobalChat(listener: (payload: any) => void) {
    if (listeners.indexOf(listener) < 0) {
      listeners.push(listener);
    }
  }

  static async unlistenForGlobalChat(listener: (payload: any) => void) {
    if (listeners.indexOf(listener) >= 0) {
      listeners.splice(listeners.indexOf(listener), 1);
    }
  }
}

export default GlobalChatState;