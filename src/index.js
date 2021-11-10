const mongoose = require('mongoose');
const socketio = require('socket.io');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const formatMessage = require('./utils/messages');
const { playerJoin, getCurrentPlayer, playerLeave, getLobbyPlayers, getCurrentPlayerBySocket } = require('./utils/players');

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
});

const JOIN_LOBBY = 'joinLobby';
const NEW_MESSAGE_EVENT = 'chatMessage';
const GO_NEXT_PAGE_EVENT = 'goToNextPage';
const LOBBY_INFO = 'lobbyInfo';
const ADMIN_ACTION = 'adminAction';
const CARD_MESSAGE_EVENT = 'cardMessage';
const LOBBY_MESSAGE_EVENT = 'lobbyMessage';
const LOBBY_PLAYER_UPDATE = 'playerUpdate';
const LOBBY_CHANGE_SEQUENCE = 'changeSequence';

const io = socketio(app);

// const io = socketio(config.socketPort, {
//   serveClient: false,
// });

// Run when client connects
io.on('connection', (socket) => {
  logger.info('Connected to Socket');
  socket.on('joinLobby', ({ playerId, playerName, lobbyCode }) => {
    logger.info('Joined Lobby');
    playerJoin(socket.id, playerId, playerName, lobbyCode);

    socket.join(lobbyCode);

    // Broadcast when a player connects
    // socket.broadcast.to(lobbyCode).emit('playerUpdate', getLobbyPlayers(lobbyCode));

    // Send to everyone
    io.to(lobbyCode).emit('lobbyInfo', {
      lobbyCode,
      players: getLobbyPlayers(lobbyCode),
    });

    io.to(lobbyCode).emit('playerUpdate', {
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
  socket.on(ADMIN_ACTION, (cardData) => {
    const player = getCurrentPlayer(cardData.player.id);
    console.log(cardData);

    // Send players and lobby info
    io.to(player.lobbyCode).emit(ADMIN_ACTION, {
      lobbyCode: player.lobbyCode,
      action: cardData.action,
    });
  });

  // Listen for lobby sequence
  socket.on(LOBBY_CHANGE_SEQUENCE, ({ sequence }) => {
    console.log(sequence);
    const player = getCurrentPlayerBySocket(socket.id);
    io.to(player.lobbyCode).emit(LOBBY_CHANGE_SEQUENCE, { sequence });
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    logger.info('Disconnected from Lobby');
    const player = playerLeave(socket.id);

    if (player) {
      io.to(player.lobbyCode).emit('playerUpdate', {
        players: getLobbyPlayers(player.lobbyCode),
      });
    }
  });
});

app.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});
