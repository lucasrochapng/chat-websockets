const socket = io();
const roomContainer = document.getElementById("room-container");
const chatContainer = document.getElementById("chat-container");
const messagesContainer = document.getElementById("messages");
const roomSelect = document.getElementById("room-select");
const usernameInput = document.getElementById("username-input");
const joinButton = document.getElementById("join-btn");
const leaveButton = document.getElementById("leave-btn");
const sendButton = document.getElementById("send-btn");
const messageInput = document.getElementById("message-input");

let currentUser = "";

// Inicialmente, mostra apenas o formulário de entrada e esconde o chat
chatContainer.style.display = "none";

function toggleChatDisplay(isInRoom) {
    if (isInRoom) {
        roomContainer.style.display = "none";
        chatContainer.style.display = "flex";
    } else {
        roomContainer.style.display = "flex";
        chatContainer.style.display = "none";
        messagesContainer.innerHTML = ""; // Limpa as mensagens ao sair
    }
}

joinButton.onclick = () => {
    const roomName = roomSelect.value;
    const username = usernameInput.value.trim();
    if (username) {
        currentUser = username;
        socket.emit("joinRoom", { roomName, username });
        toggleChatDisplay(true);
    } else {
        alert("Por favor, insira um nome para entrar na sala.");
    }
};

leaveButton.onclick = () => {
    socket.emit("leaveRoom");
    toggleChatDisplay(false);
};

sendButton.onclick = () => {
    const msg = messageInput.value;
    if (msg.trim()) {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        socket.emit("chatMessage", { msg, timestamp });
        messageInput.value = "";
    }
};

// Exibe as mensagens enviadas
socket.on("message", (data) => {
    const { text, timestamp } = data;
    const isUserMessage = text.includes(currentUser);
    displayMessage(text, timestamp, isUserMessage);
});

// Exibe a mensagem na interface
function displayMessage(message, timestamp, isUserMessage) {
    const messageBubble = document.createElement("div");
    messageBubble.classList.add("message-bubble");
    messageBubble.classList.add(isUserMessage ? "user-message" : "other-message");

    const messageText = document.createElement("p");
    messageText.textContent = message;

    const messageTime = document.createElement("span");
    messageTime.textContent = timestamp;
    messageTime.classList.add("message-time");

    messageBubble.appendChild(messageText);
    messageBubble.appendChild(messageTime);
    messagesContainer.appendChild(messageBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Rola para a última mensagem
}
