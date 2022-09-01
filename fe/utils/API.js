import axios from 'axios';
export const backUrl = process.env.NODE_ENV === 'production' ? 'http://api.nodebird.com' : 'http://localhost:8080';

const API = axios.create({
	BASE_URL: backUrl,
  headers: {
      'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default API;

