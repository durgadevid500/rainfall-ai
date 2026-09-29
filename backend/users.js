const bcrypt = require("bcryptjs");

const users = [
  {
    email: "admin@rainfallai.com",
    password: bcrypt.hashSync("Admin@123", 10),
    role: "ADMIN",
  },
  {
    email: "authority@rainfallai.com",
    password: bcrypt.hashSync("Authority@123", 10),
    role: "AUTHORITY",
  },
];

module.exports = users;