const players = [];

// Join player to chat
function playerJoin(id, playerId, playerName, lobbyCode) {
  players.push({ id, playerId, playerName, lobbyCode });
  return getCurrentPlayer(id);
}

// Get current player
function getCurrentPlayer(id) {
  return players.find((player) => player.id === id);
}

// Player leaves chat
function playerLeave(id) {
  const index = players.findIndex((player) => player.id === id);

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
  playerLeave,
  getLobbyPlayers,
};
