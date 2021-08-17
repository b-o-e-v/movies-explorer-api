const winston = require('winston');
const expressWinston = require('express-winston');
const path = require('path');

const logPath = path.join(__dirname, '../logs');

module.exports.requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: path.join(logPath, 'request.log') }),
  ],
  format: winston.format.json(),
});

module.exports.errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: path.join(logPath, 'error.log') }),
  ],
  format: winston.format.json(),
});
