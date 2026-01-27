const Axios = require("../utils/axios");

const UserService = {};

UserService.getAllUsers = async (filters = {}) => {
  const { data } = await Axios.get("users");

  const users = data.result;

  return users;
};

UserService.setPasswordByUserId = async (filters = {}) => {};

module.exports = UserService;
