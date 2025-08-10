/**
 * Configuration object containing environment variables for the MESA Risk Calculator
 * Loads values from Vite environment variables (VITE_APP_*)
 */
export const environ = {
    /** Log handler type (e.g., 'CONSOLE') */
    logHandler: import.meta.env.VITE_APP_LOG_HANDLER,
    /** Minimum log level (0-4: DEBUG, INFO, WARNING, ERROR, FATAL) */
    logLevel: import.meta.env.VITE_APP_LOG_LEVEL,
}
