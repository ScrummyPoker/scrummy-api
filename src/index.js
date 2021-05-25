const mongoose = require('mongoose');
const socketio = require('socket.io');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const formatMessage = require('./utils/messages');
const { playerJoin, getCurrentPlayer, playerLeave, getLobbyPlayers } = require('./utils/players');

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
});

const io = socketio(config.socketPort, {
  serveClient: false,
});

// Run when client connects
io.on('connection', (socket) => {
  socket.on('joinLobby', ({ playerId, playerName, lobbyCode }) => {
    playerJoin(socket.id, playerId, playerName, lobbyCode);

    socket.join(lobbyCode);

    // Broadcast when a player connects
    // socket.broadcast.to(lobbyCode).emit('newPlayer', getLobbyPlayers(lobbyCode));

    // Send to everyone
    io.to(lobbyCode).emit('lobbyInfo', {
      lobbyCode,
      players: getLobbyPlayers(lobbyCode),
    });

    io.to(lobbyCode).emit('newPlayer', {
      players: getLobbyPlayers(lobbyCode),
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    const player = getCurrentPlayer(socket.id);

    io.to(player.lobbyCode).emit('chatMessage', formatMessage(player.id, msg));
  });

  // Listen for cardChosen message
  socket.on('cardMessage', (cardData) => {
    const player = getCurrentPlayer(cardData.player.id);

    io.to(player.lobbyCode).emit('cardMessage', {
      cardChosen: cardData.cardChosen,
      lobbyCode: cardData.lobbyCode,
      player,
    });
  });

  // Listen for admin messages
  socket.on('adminAction', (cardData) => {
    const player = getCurrentPlayer(cardData.player.id);

    // Send players and lobby info
    io.to(player.lobbyCode).emit('adminAction', {
      lobbyCode: player.lobbyCode,
      action: cardData.action,
    });
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const player = playerLeave(socket.id);

    if (player) {
      // Send players and room info
      io.to(player.lobbyCode).emit('lobbyInfo', {
        room: player.lobbyCode,
        players: getLobbyPlayers(player.lobbyCode),
      });
    }
  });
});

const server = app.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});

io.attach(server, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
});
