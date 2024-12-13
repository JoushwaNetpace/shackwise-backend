import axios, { AxiosInstance } from 'axios';
import config from './config.service';

// Define a type for your API responses if needed

// Create the second Axios instance: repApiAxiosInstance
const repApiAxiosInstance: AxiosInstance = axios.create({
  baseURL:
    config.NODE_ENV == 'production'
      ? config.REAL_ESTATE_API_URL
      : 'https://cors-anywhere.herokuapp.com/' + config.REAL_ESTATE_API_URL, // Base URL for Real Estate API
  timeout: 10000,
  headers: {
    // "Content-Type": "application/json",
    'x-api-key': config.REAL_ESTATE_API_KEY,
    // "x-user-id": "UniqueUserIdentifier", // Dynamic or hardcoded as needed
  },
});

export { repApiAxiosInstance };
