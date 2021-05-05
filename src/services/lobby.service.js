const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const userService = require('./user.service');
const { Lobby } = require('../models');
const { tokenService } = require('.');
const tokenTypes = require('../config/tokens');

/**
 * Create lobby with lobby code and user owner
 * @param  {Object} lobbyBody
 * @returns {Promise<Lobby>}
 */
const createLobby = async (lobbyBody) => {
  const user = await userService.getUserById(lobbyBody.userId);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect user');
  }

  const lobbyCreated = await Lobby.create({
    code: lobbyBody.lobbyCode,
    players: [user.id],
    admins: [user.id],
  });

  return lobbyCreated;
};

/**
 * Get lobby information
 * @param  {String} lobbyCode
 * @returns {Promise<Lobby>}
 */
const getLobbyByCode = async (lobbyCode) => {
  return await Lobby.findOne({ code: lobbyCode, active: true });

  return lobby ? lobby.populate('players') : lobby;
};

/**
 * Get lobby information by ID
 * @param  {String} lobbyId
 * @returns {Promise<Lobby>}
 */
const getLobbyByID = async (lobbyId) => {
  return Lobby.findOne({ id: lobbyId });
};

/**
 * Get all active lobbies
 * @returns {Promise<QueryResult>}
 */
const getActiveLobbies = async (lobbyCode) => {
  return Lobby.find({ active: true });
};

/**
 * Register new player to lobby
 * @param  {String} lobbyCode
 * @param  {String} userId
 * @returns {Promise<Lobby>}
 */
const enterLobby = async (lobby, userId) => {
  if (lobby.players.find((t) => t.toString() === userId)) {
    //user already joined
    return lobby;
  }

  lobby.players = lobby.players.concat([
    {
      _id: userId,
      isAdmin: false,
    },
  ]);

  await lobby.save();
  return lobby;
};

const leaveLobby = async (lobby, userId) => {
  lobby.players = lobby.players.filter((t) => t.toString() !== userId);

  await lobby.save();
  return lobby;
};

const deleteLobby = async (lobby, refreshToken) => {
  if (isValidAdminInLobby(lobby, refreshToken)) {
    lobby.active = false;
    return await lobby.save();
  }

  return null;
};

const addAdminToLobby = async (lobby, adminId, refreshToken) => {
  if (isValidAdminInLobby(lobby, refreshToken)) {
    lobby.admins = lobby.admins.filter((t) => t.toString() !== adminId).concat([adminId]);
    await lobby.save();
  }
};

const removeAdminFromLobby = async (lobby, adminId, refreshToken) => {
  if (isValidAdminInLobby(lobby, refreshToken)) {
    lobby.admins = lobby.admins.filter((t) => t.toString() !== adminId);
    await lobby.save();
  }
};

const isValidAdminInLobby = async (lobby, refreshToken) => {
  try {
    const userId = await tokenService.getUserIdByToken(refreshToken);
    const user = await userService.getUserById(userId);

    const isAdmin = lobby.toObject().admins.find((t) => t.toString() == user.id);

    if (!user || !isAdmin) {
      throw new Error();
    }

    return true;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

module.exports = {
  createLobby,
  getLobbyByCode,
  getLobbyByID,
  getActiveLobbies,
  enterLobby,
  leaveLobby,
  deleteLobby,
  addAdminToLobby,
  removeAdminFromLobby,
};
