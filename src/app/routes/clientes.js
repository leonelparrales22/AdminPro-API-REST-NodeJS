const dbConnection = require("../../config/dbConnection");

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
        "SELECT COUNT(*) AS TOTAL FROM `CLIENTES`",
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

  app.get("/todos-clientes", async (req, res) => {
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
      `SELECT * FROM CLIENTES ORDER BY CLIENTES.apellido_cliente ASC LIMIT 7 OFFSET ${desde}`,
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

  app.get("/clientes", async (req, res) => {
    connection.query(
      `SELECT * FROM CLIENTES ORDER BY CLIENTES.apellido_cliente ASC`,
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

  app.post("/insertar-cliente", (req, res) => {
    const {
      cedula_cliente,
      nombre_cliente,
      apellido_cliente,
      direccion_cliente,
    } = req.body;
    connection.query(
      "INSERT INTO CLIENTES SET?",
      {
        cedula_cliente,
        nombre_cliente,
        apellido_cliente,
        direccion_cliente,
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

  app.put("/editar-cliente", (req, res) => {
    const {
      cedula_cliente,
      nombre_cliente,
      apellido_cliente,
      direccion_cliente,
    } = req.body;
    connection.query(
      `UPDATE CLIENTES SET nombre_cliente='${nombre_cliente}', apellido_cliente='${apellido_cliente}', direccion_cliente='${direccion_cliente}' WHERE cedula_cliente='${cedula_cliente}'`,
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
