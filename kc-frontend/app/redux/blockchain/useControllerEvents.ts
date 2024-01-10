import APIClient from "@/app/adapters/APIClient";
import { useEffect } from "react";

export default function useControllerEvents(listeners: Record<string, ()=>void>) {
  useEffect(() => {
    const unlisteners = Promise.all(Object.entries(listeners).map(([key, fn])=>APIClient.listenController(key, fn)));

    return () => {
      // unlisten to all the events
      unlisteners.then(e=>e.map(a=>a()));
    }
  }, [listeners]);
}