async function sendMessage() {
  const input = document.getElementById("userInput");
  const messages = document.getElementById("messages");
  const btn = document.getElementById("sendBtn");

  const text = input.value.trim();
  if (!text) return;

  // Remove welcome message if first message
  const welcome = messages.querySelector(".welcome");
  if (welcome) welcome.remove();

  // Show user message
  const userDiv = document.createElement("div");
  userDiv.className = "message user";
  userDiv.textContent = text;
  messages.appendChild(userDiv);

  // Clear input and disable button
  input.value = "";
  btn.disabled = true;
  btn.textContent = "Sending...";

  // Show loading
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "message ai";
  loadingDiv.textContent = "Thinking...";
  messages.appendChild(loadingDiv);
  messages.scrollTop = messages.scrollHeight;

  try {
    const response = await fetch("http://localhost:5000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();
    loadingDiv.textContent = data.response || data.error;

  } catch (error) {
    loadingDiv.textContent = "Error: Could not connect to server.";
  }

  btn.disabled = false;
  btn.textContent = "Send";
  messages.scrollTop = messages.scrollHeight;
}

// Send on Enter key
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("userInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
});