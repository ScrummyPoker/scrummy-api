const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { lobbyService } = require('../services');
const ApiError = require('../utils/ApiError');

const createLobby = catchAsync(async (req, res) => {
  const lobby = await lobbyService.getLobbyByCode(req.body.code);

  if (lobby) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Lobby with same code already exists');
  }

  const lobbyCreated = await lobbyService.createLobby(req.body);
  res.status(httpStatus.CREATED).send(lobbyCreated);
});

const getLobbyInfo = catchAsync(async (req, res) => {
  const lobby = await lobbyService.getLobbyByCode(req.params.lobbyCode);
  if (!lobby) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lobby not found');
  }
  res.send(lobby);
});

const getActiveLobbies = catchAsync(async (req, res) => {
  const allLobbies = await lobbyService.getActiveLobbies();
  if (!allLobbies) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lobby not found');
  }
  res.send(allLobbies);
});

const enterLobby = catchAsync(async (req, res) => {
  const lobby = await lobbyService.getLobbyByCode(req.params.lobbyCode);

  if (!lobby) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lobby not found');
  }

  const newLobby = await lobbyService.enterLobby(lobby, req.body.userId);
  res.send(newLobby);
});

const leaveLobby = catchAsync(async (req, res) => {
  const lobby = await lobbyService.getLobbyByCode(req.params.lobbyCode);

  if (!lobby) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lobby not found');
  }

  if (!lobby.players.find((t) => t._id === userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Player is not registered in this lobby');
  }

  const newLobby = await lobbyService.leaveLobby(lobby, req.body.userId);
  res.send(newLobby);
});

const deleteLobby = catchAsync(async (req, res) => {
  const lobby = await lobbyService.getLobbyByCode(req.params.lobbyCode);

  if (!lobby) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lobby not found');
  }

  try {
    await lobbyService.deleteLobby(lobby, req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (e) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Could not delete lobby: ' + e);
  }
});

const addAdminToLobby = catchAsync(async (req, res) => {
  const lobby = await lobbyService.getLobbyByCode(req.params.lobbyCode);

  if (!lobby) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lobby not found');
  }

  const newLobby = await lobbyService.addAdminToLobby(lobby, req.body.adminId, req.body.refreshToken);
  res.send(newLobby);
});

const removeAdminFromLobby = catchAsync(async (req, res) => {
  const lobby = await lobbyService.getLobbyByCode(req.params.lobbyCode);

  if (!lobby) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lobby not found');
  }

  if (lobby.admins.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot remove the last admin of the lobby');
  }

  const newLobby = await lobbyService.addAdminToLobby(lobby, req.body.adminId, req.body.refreshToken);
  res.send(newLobby);
});
removeAdminFromLobby;

module.exports = {
  createLobby,
  getLobbyInfo,
  getActiveLobbies,
  enterLobby,
  leaveLobby,
  deleteLobby,
  addAdminToLobby,
  removeAdminFromLobby,
};
