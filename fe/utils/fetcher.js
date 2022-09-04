import axios from 'axios';

axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'http://52.198.206.8' : 'http://localhost:8080';

const fetcher = (url) =>
  axios
    .get(url, {
      withCredentials: true,
    })
    .then((response) => response.data);

export default fetcher;