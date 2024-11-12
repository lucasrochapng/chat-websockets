// Bibliotecas
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app); // Cria o servidor HTTP
const io = new Server(server); // Inicia o servidor

app.use(express.static("public"));

const predefinedRooms = ["Sala 1", "Sala 2", "Sala 3"];
const users = {};

// Gerencia de conexão ao Socket.io
io.on("connection", (socket) => {
    console.log("Usuário conectado:", socket.id);

    // Entrada do usuário na sala
    socket.on("joinRoom", ({ roomName, username }) => {
        if (predefinedRooms.includes(roomName)) {
            socket.join(roomName);
            users[socket.id] = { username, roomName };

            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Envia uma mensagem de boas-vindas ao usuário que acabou de entrar
            socket.emit("message", { text: `Você entrou na ${roomName} como ${username}`, timestamp });

            // Notifica os outros usuários na sala sobre a entrada do novo usuário
            socket.to(roomName).emit("message", { text: `${username} entrou na sala`, timestamp });
        }
    });

    // Saída do usuário da sala
    socket.on("leaveRoom", () => {
        const user = users[socket.id];
        if (user) { 
            const { roomName, username } = user;
            socket.leave(roomName); 

            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Notifica os outros usuários da sala sobre a saída do usuário
            socket.to(roomName).emit("message", { text: `${username} saiu da sala`, timestamp });

            delete users[socket.id]; 
        }
    });

    // Envio de mensagens de chat
    socket.on("chatMessage", ({ msg, timestamp }) => {
        const user = users[socket.id]; 
        if (user) {
            const { roomName, username } = user;

            // Envia a mensagem para todos os usuários na sala
            io.to(roomName).emit("message", { text: `${username}: ${msg}`, timestamp });
        }
    });

    // Evento para quando o usuário desconecta
    socket.on("disconnect", () => {
        const user = users[socket.id]; // Obtém o usuário que desconectou
        if (user) {
            const { roomName, username } = user;

            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Notifica os outros usuários da sala sobre a desconexão do usuário
            socket.to(roomName).emit("message", { text: `${username} desconectou`, timestamp });

            delete users[socket.id];
        }
    });
});

server.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
