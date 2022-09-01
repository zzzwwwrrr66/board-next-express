import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';

const fetcher = (url) =>
  axios
    .get(url, {
      withCredentials: true,
    })
    .then((response) => response.data);

export default fetcher;