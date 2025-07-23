import { createLogger, format, transports } from 'winston';
 
// Define custom colors for each logging level
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',   // This sets info logs to green color
    http: 'magenta',
    verbose: 'cyan',
    debug: 'white',
    silly: 'gray',
  },
};
 
import winston from 'winston';
winston.addColors(customLevels.colors);
 
// Logger configuration
const logger = createLogger({
  levels: customLevels.levels,
  format: format.combine(
    format.colorize({ all: true }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports: [new transports.Console()],
});
 
export default logger;