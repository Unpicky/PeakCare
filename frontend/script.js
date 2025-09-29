const startBtn = document.getElementById("startBtn");
const messagesDiv = document.getElementById("messages");

let ws;

function addMessage(text, sender="bot") {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerText = text;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

startBtn.addEventListener("click", async () => {
  try {
    ws = new WebSocket("wss://" + window.location.host + "/ws");

    ws.onopen = () => {
      addMessage("🎤 Connected to agent...", "user");
      ws.send("hello agent");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "text") {
        addMessage(data.text, "bot");
      }

      if (data.type === "audio") {
        const audioBlob = base64ToBlob(data.audio, "audio/mpeg");
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      }
    };
  } catch (err) {
    console.error("Error:", err);
  }
});

function base64ToBlob(base64, mime) {
  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  return new Blob([new Uint8Array(byteNumbers)], { type: mime });
}
