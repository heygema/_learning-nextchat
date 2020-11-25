import {useEffect} from 'react';
import io from 'socket.io-client';
// @ts-ignore
const socket = io();

// TODO: type for callback
export function useSocket(eventName: string, cb: Function) {
  useEffect(() => {
    socket.on(eventName, cb);

    return function useSocketCleanup() {
      socket.off(eventName, cb);
    };
  }, [eventName, cb]);

  return socket;
}
