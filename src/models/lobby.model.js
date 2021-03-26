const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const lobbySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
    },
    players: [{ 
      type: mongoose.SchemaTypes.ObjectId, 
      ref: "User",
      default: undefined,
    }],
    admins: [{ 
      type: mongoose.SchemaTypes.ObjectId, 
      ref: "User",
      default: undefined,
    }],
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps:true,
  }
);

// add plugin that converts mongoose to json
lobbySchema.plugin(toJSON);
lobbySchema.plugin(paginate);

/**
 * @typedef Lobby
 */
 const Lobby = mongoose.model('Lobby', lobbySchema);

 module.exports = Lobby;
 