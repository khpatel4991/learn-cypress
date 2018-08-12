const winston = require('winston');

const filename = "qwe"

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: `${filename}.log` })
  ]
});

module.exports = logger;
