const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static("../frontend")); // serve frontend

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: "/ws" });

// Fake TTS audio (replace with your own integration)
const fs = require("fs");
let mp3Buffer;
try {
  mp3Buffer = fs.readFileSync("sample.mp3");
} catch (err) {
  console.warn("No sample.mp3 found, using empty buffer");
  mp3Buffer = Buffer.from([]);
}

function toBase64(buffer) {
  return buffer.toString("base64");
}

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (msg) => {
    console.log("Received:", msg.toString());

    ws.send(JSON.stringify({
      type: "text",
      text: "Здравствуйте! Я ваш голосовой агент."
    }));

    if (mp3Buffer.length > 0) {
      ws.send(JSON.stringify({
        type: "audio",
        audio: toBase64(mp3Buffer)
      }));
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
