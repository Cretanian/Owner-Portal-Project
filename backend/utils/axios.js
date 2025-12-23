const axios = require("axios");

const Axios = axios.create({
  baseURL: "https://api.hostaway.com/v1",
  headers: {
    Authorization: `Bearer ${process.env.API_ACCESS_TOKEN}`,
  },
});

module.exports = Axios;
