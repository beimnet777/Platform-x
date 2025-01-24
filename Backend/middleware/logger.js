const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { format } = require('winston');
const path = require('path');

// Define custom formats
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
);

// Create logger instance with daily log rotation
const logger = winston.createLogger({
  format: logFormat,
  transports: [
    // Log all info level logs to a daily rotating file
    new DailyRotateFile({
      filename: path.join(__dirname, '../logs', 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d', // Keep logs for 14 days
      level: 'info',
    }),
    // Log all errors to a separate file
    new DailyRotateFile({
      filename: path.join(__dirname, '../logs', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d', // Keep error logs for 30 days
      level: 'error',
    }),
    // Optionally log to console
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        logFormat
      )
    })
  ],
});

// Middleware for logging requests
const requestLogger = (req, res, next) => {
  const user = req.user ? req.user.username : 'Guest'; // Customize as per your auth mechanism
  const ip = req.ip || req.connection.remoteAddress;
  const method = req.method;
  const url = req.originalUrl;
  const timestamp = new Date().toISOString();

  const logMessage = `Request from ${user} at ${ip} - ${method} ${url} - ${timestamp}`;
  logger.info(logMessage);

  next();
};

// Middleware for logging errors
const errorLogger = (err, req, res, next) => {
  const user = req.user ? req.user.username : 'Guest';
  const ip = req.ip || req.connection.remoteAddress;
  const method = req.method;
  const url = req.originalUrl;
  const timestamp = new Date().toISOString();

  const errorMessage = `Error in request from ${user} at ${ip} - ${method} ${url} - ${timestamp} - Error: ${err.message}`;
  logger.error(errorMessage);

  next(err); // Pass to default error handler
};

module.exports = { logger, requestLogger, errorLogger };
