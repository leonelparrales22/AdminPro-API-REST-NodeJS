const dbConnection = require("../../config/dbConnection");
const { v4: uuidv4 } = require("uuid");

module.exports = (app) => {
  const connection = dbConnection();
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "PUT, POST, GET, DELETE, OPTIONS"
    );

    next();
  });

  app.get("/login", async (req, res) => {
    const cedula_usuario = req.query.cedula_usuario;
    const contrasenia = req.query.contrasenia;
    console.log("c", cedula_usuario, contrasenia);
    connection.query(
      `SELECT * FROM USUARIOS WHERE cedula_usuario='${cedula_usuario}' AND contrasenia='${contrasenia}'`,
      (err, result) => {
        if (err)
          return res.status(400).json({
            ok: false,
            err,
          });

        return res.json({
          ok: true,
          result
        });
      }
    );
  });
};
