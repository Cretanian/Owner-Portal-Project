const Axios = require("../utils/axios");

const UserService = {};

UserService.getAllUsers = async (filters = {}) => {
  const { data } = await Axios.get("users");

  const users = data.result;

  return users;
};

UserService.getUserById = async (id) => {
  const { data } = await Axios.get(`user/${id}`);

  const user = data.result;

  return user;
};

module.exports = UserService;
