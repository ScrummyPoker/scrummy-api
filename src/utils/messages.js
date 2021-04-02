const moment = require('moment');

function formatMessage(playerId, text) {
  return {
    playerId,
    text,
    time: moment().format('h:mm a')
  };
}

module.exports = formatMessage;