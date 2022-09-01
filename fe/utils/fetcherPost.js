import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';

const fetcherPost = (params) => (url) =>
  axios
    .post(url, params, {
      withCredentials: true,
    })
    .then((response) => response.data);

export default fetcherPost;