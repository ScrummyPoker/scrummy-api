const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages.js');
const {
  playerJoin,
  getCurrentPlayer,
  playerLeave,
  getLobbyPlayers
} = require('./utils/players');

const server = app.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
});

const io = socketio(4444);
const botName = "Scrummy Bot";

// Run when client connects
io.on('connection', socket => {
  socket.on('joinLobby', ({ playerId, lobbyCode }) => {
    const player = playerJoin(socket.id, playerId, lobbyCode);

    socket.join(player.lobbyCode);

    // Welcome current player
    socket.emit('lobbyMessage', formatMessage(botName, 'Welcome to ChatCord!'));

    // Broadcast when a player connects
    socket.broadcast
      .to(player.lobbyCode)
      .emit(
        'lobbyMessage',
        formatMessage(botName, `${player.playername} has joined the chat`)
      );

    // Send players and lobby info
    io.to(player.lobbyCode).emit('lobbyInfo', {
      lobbyCode: player.lobbyCode,
      players: getLobbyPlayers(player.lobbyCode)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const player = getCurrentPlayer(socket.id);

    io.to(player.lobbyCode).emit('chatMessage', formatMessage(player.id, msg));
  });

  // Listen for cardChosen message
  socket.on('cardMessage', messageData => {
    const player = getCurrentPlayer(socket.id);

    io.to(player.lobbyCode).emit('cardMessage', formatMessage(player.id, messageData));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const player = playerLeave(socket.id);

    if (player) {
      io.to(player.lobbyCode).emit(
        'lobbyMessage',
        formatMessage(botName, `${player.lobbyPlayers} has left the chat`)
      );

      // Send players and room info
      io.to(player.lobbyCode).emit('lobbyInfo', {
        room: player.lobbyCode,
        players: getLobbyPlayers(player.lobbyCode)
      });
    }
  });
});


const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
