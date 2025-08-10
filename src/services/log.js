/**
 * Logging service for the MESA Risk Calculator application
 * Provides configurable logging with multiple handlers and levels
 */

let logFunction = NaN;

/**
 * Log level constants for filtering messages
 */
const LEVEL = {
  DEBUG: 0,
  INFO:  1,
  WARNING: 2,
  ERROR: 3,
  FATAL: 4
};

/**
 * Available log handlers for different output destinations
 */
const HANDLER = {
  CONSOLE: (...someMixedValues) => {
    console.log(...someMixedValues);
  }
};

/**
 * Sets the minimum log level for filtering messages
 * @param {number} log_level - Minimum level (0-4) to log
 */
function setLogLevel(log_level){
  localStorage.setItem('bhDebugLevel', log_level);
}

/**
 * Sets the log handler function for output destination
 * @param {string} logHandler - Handler name (e.g., 'CONSOLE')
 */
function setLogHandler(logHandler){
  console.log('Setup log function', logHandler);
  logFunction = HANDLER[logHandler];
}
/**
 * Core logging function that filters messages by level or emergency debug mode
 * @param {number} message_log_level - Level of the message being logged
 * @param {...any} someMixedValues - Values to log
 */
function logger(message_log_level, ...someMixedValues) {
  const debugMode = localStorage.getItem('bhDebugMode');
  // Emergency debug mode logs everything
  if(debugMode && debugMode === 'cef8d978-169e-4759-bddf-18b06007f11e'){
      console.log(...someMixedValues);
  } else {
      const env_log_level = localStorage.getItem('bhDebugLevel');
      if(env_log_level <= message_log_level){
        try{
          logFunction(...someMixedValues);
        } catch(error){
          console.error("Log module error - falling back to console:", error);
          console.log(...someMixedValues);
        }
      }
  }
}

/**
 * Logs debug level messages
 * @param {...any} someMixedValues - Values to log
 */
function debug(...someMixedValues){
  logger(LEVEL.DEBUG, ...someMixedValues);
}

/**
 * Logs info level messages
 * @param {...any} someMixedValues - Values to log
 */
function info(...someMixedValues){
  logger(LEVEL.INFO, ...someMixedValues);
}

/**
 * Logs warning level messages
 * @param {...any} someMixedValues - Values to log
 */
function warning(...someMixedValues){
  logger(LEVEL.WARNING, ...someMixedValues);
}

/**
 * Logs error level messages
 * @param {...any} someMixedValues - Values to log
 */
function error(...someMixedValues){
  logger(LEVEL.ERROR, ...someMixedValues);
}

/**
 * Logs fatal level messages
 * @param {...any} someMixedValues - Values to log
 */
function fatal(...someMixedValues){
  logger(LEVEL.FATAL, ...someMixedValues);
}

/**
 * Main log object with all logging functionality
 */
const log = {
  LEVEL,
  HANDLER,
  init:{
    setLogHandler,
    setLogLevel        
  },
  debug,
  info,
  warning,
  error,
  fatal
};

export default log;
