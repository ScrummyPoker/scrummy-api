const Joi = require('joi');
const { password } = require('./custom.validation');

const createLobby = {
  body: Joi.object().keys({
    lobbyCode: Joi.string().required(),
    userId: Joi.string().required(),
  }),
};

const getLobbyInfo = {
  params: Joi.object().keys({
    lobbyCode: Joi.string().required(),
  }),
};

const getAllLobies = {
  query: Joi.object().keys({
    lobbyCode: Joi.string(),
  }),
};

const enterLobby = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  params: Joi.object().keys({
    lobbyCode: Joi.string().required(),
  }),
};

const leaveLobby = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  params: Joi.object().keys({
    lobbyCode: Joi.string().required(),
  }),
};

const deleteLobby = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
  params: Joi.object().keys({
    lobbyCode: Joi.string().required(),
  }),
};

const addAdminToLobby = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
    adminId: Joi.string().required(),
  }),
  params: Joi.object().keys({
    lobbyCode: Joi.string().required(),
  }),
};

const removeAdminFromLobby = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
    adminId: Joi.string().required(),
  }),
  params: Joi.object().keys({
    lobbyCode: Joi.string().required(),
  }),
};

