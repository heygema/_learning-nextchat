import { useEffect, useState } from "react";
import io from "socket.io-client";

function MyApp({ Component, pageProps }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socket) {
      //@ts-ignore
      setSocket(io());
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  });

  return <Component {...pageProps} socket={socket} />;
}

export default MyApp;
