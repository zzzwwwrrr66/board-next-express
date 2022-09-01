import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';

const fetcherDelete = (url, params) =>{
  return axios
    .delete(url, params, {
      withCredentials: true,
    })
    .then((response) => response.data);
  }

export default fetcherDelete;