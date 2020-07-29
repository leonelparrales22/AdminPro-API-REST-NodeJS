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
          result,
        });
      }
    );
  });

  const n_registros = () => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT(*) AS TOTAL FROM `USUARIOS`",
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result[0].TOTAL);
          return;
        }
      );
    });
  };

  app.get("/todos-usuarios", async (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    total = 0;
    await n_registros()
      .then((data) => {
        total = data;
      })
      .catch((err) => {
        console.error(err);
      });
    connection.query(
      `SELECT * FROM USUARIOS ORDER BY rol ASC LIMIT 7 OFFSET ${desde}`,
      (err, result) => {
        if (err)
          return res.status(400).json({
            ok: false,
            err,
          });
        return res.json({
          ok: true,
          result,
          total,
        });
      }
    );
  });

  app.post("/insertar-usuario", (req, res) => {
    const { cedula_usuario, contrasenia, rol } = req.body;
    connection.query(
      "INSERT INTO USUARIOS SET?",
      {
        cedula_usuario,
        contrasenia,
        rol,
      },
      (err, result) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
        });
      }
    );
  });


  app.put("/editar-usuario", (req, res) => {
    const {
      cedula_usuario,
      rol,
    } = req.body;
    connection.query(
      `UPDATE USUARIOS SET rol='${rol}' WHERE cedula_usuario='${cedula_usuario}'`,
      (err, result) => {
        if (err)
          return res.status(400).json({
            ok: false,
            err,
          });
        return res.json({
          ok: true,
          result,
        });
      }
    );
  });



};
