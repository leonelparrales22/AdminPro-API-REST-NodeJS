const mysql = require("mysql");

// module.exports = () => {
//   return mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "123456",
//     database: "bdd",
//   });
// };


module.exports = () => {
  return mysql.createConnection({
    host: "85.10.205.173",
    user: "leonelparrales22",
    password: "Pinguino2233",
    database: "adminpro",
  });
};
