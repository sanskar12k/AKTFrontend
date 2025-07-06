import axios from "axios";
  const api = "https://akt-backend.web.app/"
  //const api = "http://localhost:8000/"

const Api = axios.create({
 baseURL: api,
});
Api.defaults.headers.post['Content-Type'] = 'application/json';

export default Api;