import axios from "axios";
import log from "./log";

/**
 * HTTP service module providing axios configuration and interceptors
 * Handles network errors and API communication for MESA risk calculator
 */

/**
 * Axios response interceptor for handling network and server errors
 */
axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status <= 500;

  if (!expectedError) {
    if(error.code === "ERR_NETWORK") {
      log.fatal("Network connection error - please check your internet connection");
      throw new Error("ERR_NETWORK");
    } else {
      log.error('Axios response error', error);
      throw new Error(error);
    }
  }

  if(error && error.response && error.response.status) {
    console.error(error.response);
  }
  return Promise.reject(error);
});

/**
 * Sets the API base URL for all axios requests
 * @param {string} app_url - The base URL for API calls
 */
export function setAppApiRootUrl(app_url) {
  axios.defaults.baseURL = app_url;
  log.debug("APP api root url: ", axios.defaults.baseURL);
}

/**
 * Gets the current API base URL
 * @returns {string} The current API base URL
 */
export function getApiRootUrl(){
  return axios.defaults.baseURL;
}

/**
 * HTTP client object with axios methods
 */
const http = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete
};

export default http;

/**
 * Wrapper function for API responses to validate status codes
 * @param {Object} response - HTTP response object
 * @param {Function} callback - Callback function to process valid responses
 * @returns {*} Result of callback function
 * @throws {Error} Throws error for invalid response status codes
 */
export function fastApiWrapper(response, callback){
  log.debug("API Response:", response);

  // Check if response status is in valid range (200-299)
  if(!response.status || response.status > 299 || response.status < 200){
    console.error('API response error', response);
    throw new Error(response);    
  }

  return callback(response);
}

/**
 * Wraps an API call with comprehensive error handling and response processing
 * @param {Promise} myPromise - The API promise to handle
 * @param {Function} successCallback - Function to call on successful response
 * @param {Function} errorCallback - Function to call on error
 * @param {Function} [finallyCallback=null] - Optional function to call after completion
 */
export function responsePromiseChainHandler(myPromise, successCallback, errorCallback, finallyCallback = null){
  if(finallyCallback){
    myPromise
      .then(response => fastApiWrapper(response, successCallback))
      .catch(errorCallback)
      .finally(finallyCallback);
  } else {
    myPromise
      .then(response => fastApiWrapper(response, successCallback))
      .catch(errorCallback);
  }
}
