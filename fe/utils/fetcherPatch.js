import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';

const fetcherPatch = (params) => (url) =>
  axios
    .patch(url, params, {
      withCredentials: true,
    })
    .then((response) => response.data);

export default fetcherPatch;