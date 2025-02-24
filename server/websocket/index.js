import { WebSocketServer } from "ws";

export function setupWebSocketServer(server) {
  const wss = new WebSocketServer({ server });
  const clients = new Map();

  wss.on("connection", (ws) => {
    const id = Math.random().toString(36).substring(7);
    clients.set(id, ws);

    ws.on("message", (message) => {
      const data = JSON.parse(message);
      if (data.type === "subscribe") {
        ws.channel = data.channel;
      }
    });

    ws.on("close", () => {
      clients.delete(id);
    });
  });

  return {
    broadcast: (channel, payload) => {
      clients.forEach((client) => {
        if (client.channel === channel) {
          client.send(JSON.stringify({ channel, payload }));
        }
      });
    },
  };
}
