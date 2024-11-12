const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// Salas predefinidas
const predefinedRooms = ["Sala 1", "Sala 2", "Sala 3"];
const users = {};

io.on("connection", (socket) => {
    console.log("Usuário conectado:", socket.id);

    // Entrar na sala com nome de usuário
    socket.on("joinRoom", ({ roomName, username }) => {
        if (predefinedRooms.includes(roomName)) {
            socket.join(roomName);
            users[socket.id] = { username, roomName };

            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Enviar mensagem de entrada para o usuário
            socket.emit("message", { text: `Você entrou na ${roomName} como ${username}`, timestamp });

            // Enviar mensagem de sistema para os outros usuários da sala
            socket.to(roomName).emit("message", { text: `${username} entrou na sala`, timestamp });
        }
    });

    // Sair da sala
    socket.on("leaveRoom", () => {
        const user = users[socket.id];
        if (user) {
            const { roomName, username } = user;
            socket.leave(roomName);

            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Enviar mensagem de saída para os outros usuários da sala
            socket.to(roomName).emit("message", { text: `${username} saiu da sala`, timestamp });

            delete users[socket.id];
        }
    });

    // Enviar mensagem
    socket.on("chatMessage", ({ msg, timestamp }) => {
        const user = users[socket.id];
        if (user) {
            const { roomName, username } = user;

            // Emitir mensagem de chat para a sala
            io.to(roomName).emit("message", { text: `${username}: ${msg}`, timestamp });
        }
    });

    // Desconectar
    socket.on("disconnect", () => {
        const user = users[socket.id];
        if (user) {
            const { roomName, username } = user;

            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Enviar mensagem de desconexão para os outros usuários da sala
            socket.to(roomName).emit("message", { text: `${username} desconectou`, timestamp });

            delete users[socket.id];
        }
    });
});

server.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
