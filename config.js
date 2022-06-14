require("dotenv").config();

module.exports = {
  spinalConnector: {
    user: process.env.USER_ID || "EDIT_ME",
    password: process.env.USER_MDP || "EDIT_ME",
    host: process.env.HUB_HOST || "localhost",
    port: process.env.HUB_PORT || "EDIT_ME",
  },
  config: {
    server_port: process.env.SERVER_PORT || 2022,
    directory_path: process.env.CONFIG_DIRECTORY_PATH || "/__users__/admin/",
    fileName: process.env.CONFIG_FILE_NAME || "PAMConfig",
  },
};
