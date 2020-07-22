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

  const n_registros = () => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT(*) AS TOTAL FROM `CELULARES`",
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

  app.get("/todos-celulares", async (req, res) => {
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
      `SELECT * FROM CELULARES ORDER BY CELULARES.nombre_celular ASC LIMIT 7 OFFSET ${desde}`,
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

  app.post("/insertar-celular", (req, res) => {
    const {
      nombre_celular,
      marca_celular,
      stock_celular,
      precio_celular,
    } = req.body;
    connection.query(
      "INSERT INTO CELULARES SET?",
      {
        id_celular: uuidv4(),
        nombre_celular,
        marca_celular,
        stock_celular,
        precio_celular,
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

  app.put("/editar-celular", (req, res) => {
    const {
      id_celular,
      nombre_celular,
      marca_celular,
      stock_celular,
      precio_celular,
    } = req.body;
    connection.query(
      `UPDATE CELULARES SET nombre_celular='${nombre_celular}', marca_celular='${marca_celular}', stock_celular=${stock_celular}, precio_celular=${precio_celular} WHERE id_celular='${id_celular}'`,
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
