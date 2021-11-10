const players = [];

// Get current player
function getCurrentPlayer(id) {
  return players.find((player) => player.id === id);
}

//Get player by socket
function getCurrentPlayerBySocket(socketId) {
  return players.find((player) => player.socketId === socketId);
}

// Join player to chat
function playerJoin(socketId, id, playerName, lobbyCode) {
  let player = getCurrentPlayer(id);
  if (!player && id && playerName) {
    player = { socketId, id, playerName, lobbyCode };
    players.push(player);
  }

  return player;
}

// Player leaves chat
function playerLeave(socketId) {
  const index = players.findIndex((player) => player.socketId === socketId);

  if (index !== -1) {
    return players.splice(index, 1)[0];
  }
}

// Get room players
function getLobbyPlayers(lobbyCode) {
  return players.filter((player) => player.lobbyCode === lobbyCode);
}

module.exports = {
  playerJoin,
  getCurrentPlayer,
  getCurrentPlayerBySocket,
  playerLeave,
  getLobbyPlayers,
};
