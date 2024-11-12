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

// Guardando o nome do usuário atual
let currentUser = "";

// Oculta inicialmente o contêiner de chat, mostrando apenas o formulário de entrada
chatContainer.style.display = "none";

// Função que alterna entre mostrar o formulário de entrada ou a interface de chat
function toggleChatDisplay(isInRoom) {
    if (isInRoom) {
        roomContainer.style.display = "none";
        chatContainer.style.display = "flex";
    } else {
        roomContainer.style.display = "flex";
        chatContainer.style.display = "none";
        messagesContainer.innerHTML = "";
    }
}

// Botão para entrar na sala
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

// Botão para sair da sala
leaveButton.onclick = () => {
    socket.emit("leaveRoom");
    toggleChatDisplay(false);
};

// Botão para enviar mensagem
sendButton.onclick = () => {
    const msg = messageInput.value;
    if (msg.trim()) {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        socket.emit("chatMessage", { msg, timestamp });
        messageInput.value = ""; 
    }
};

// Recebe mensagens do servidor e as exibe na interface
socket.on("message", (data) => {
    const { text, timestamp } = data;
    const isUserMessage = text.includes(currentUser);
    displayMessage(text, timestamp, isUserMessage);
});

// Função para exibir a mensagem na interface do usuário
function displayMessage(message, timestamp, isUserMessage) {
    const messageBubble = document.createElement("div"); // Cria um contêiner para a mensagem
    messageBubble.classList.add("message-bubble"); // Adiciona a classe básica para as bolhas de mensagem
    messageBubble.classList.add(isUserMessage ? "user-message" : "other-message"); // Adiciona a classe específica, dependendo de quem enviou a mensagem

    const messageText = document.createElement("p"); // Elemento que contém o texto da mensagem
    messageText.textContent = message; // Define o conteúdo da mensagem

    const messageTime = document.createElement("span"); // Elemento que exibe o horário da mensagem
    messageTime.textContent = timestamp; // Define o horário da mensagem
    messageTime.classList.add("message-time"); // Adiciona a classe para formatar o horário

    // Estrutura a mensagem juntando o texto e o horário
    messageBubble.appendChild(messageText);
    messageBubble.appendChild(messageTime);

    // Adiciona a mensagem ao contêiner de mensagens
    messagesContainer.appendChild(messageBubble);

    // Rola automaticamente para a última mensagem exibida
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
