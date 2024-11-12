# 💬 Chat em Tempo Real com Node.js e Socket.io

Este é um projeto de um sistema de chat em tempo real, desenvolvido com Node.js e Socket.io. Ele permite que os usuários entrem em salas predefinidas e enviem mensagens em tempo real para outros participantes da sala.

## 🛠️ Pré-requisitos

Para rodar esta aplicação, você precisa ter os seguintes itens instalados na sua máquina:

- [Node.js](https://nodejs.org) (v12+)
- [npm](https://www.npmjs.com/) (gerenciador de pacotes do Node.js)

## 🚀 Instruções para rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/lucasrochapng/chat-websockets.git
cd nome-do-repositorio
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o servidor

Para iniciar o servidor, execute:

```bash
npm start
```

### 4. Acesse o aplicativo
Abra o navegador e acesse http://localhost:3000. A partir daí, você pode escolher uma sala e começar a conversar com outros usuários conectados!

## 🗃️ Estrutura do Projeto
server.js - Configura o servidor Express e o Socket.io.
public/client.js - Contém a lógica do cliente para se conectar ao Socket.io e exibir mensagens.
public/index.html - Arquivo HTML que serve como interface do chat.
.gitignore - Ignora arquivos e diretórios que não devem ser enviados ao repositório.

## 📝 Funcionalidades
Entrar em salas de chat: Escolha entre salas predefinidas para se juntar e conversar.
Mensagens em tempo real: Envie mensagens e as veja aparecer instantaneamente na sala.
Notificações de entrada e saída: Receba notificações quando outros usuários entrarem ou saírem da sala.










