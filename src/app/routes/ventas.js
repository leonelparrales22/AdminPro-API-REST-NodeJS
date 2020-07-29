const dbConnection = require("../../config/dbConnection");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

module.exports = async (app) => {
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

  app.post("/insertar-venta", (req, res) => {
    const codigo_venta = uuidv4();
    const fecha = moment().format("YYYY-MM-DD HH:mm:ss");
    const { cedula_usuario, cedula_cliente, array_ventas } = req.body;
    console.log(array_ventas, cedula_usuario, cedula_cliente);
    console.log(codigo_venta);
    // TABLA VENTAS
    connection.query(
      "INSERT INTO VENTAS SET?",
      {
        codigo_venta,
        cedula_cliente,
        cedula_usuario,
        fecha,
      },
      (err, result) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
      }
    );

    // TABLA DETALLE VENTA
    var total = 0;
    array_ventas.forEach((element) => {
      total += element.celular.precio_celular * element.cantidad;
      connection.query(
        "INSERT INTO DETALLE_VENTA SET?",
        {
          codigo_venta,
          id_celular: element.celular.id_celular,
          cantidad: element.cantidad,
        },
        (err, result) => {
          if (err) {
            return res.status(400).json({
              ok: false,
              err,
            });
          }
        }
      );
      connection.query(
        `UPDATE CELULARES SET CELULARES.stock_celular=CELULARES.stock_celular-${element.cantidad} WHERE id_celular='${element.celular.id_celular}'`,
        {
          codigo_venta,
          id_celular: element.celular.id_celular,
          cantidad: element.cantidad,
        },
        (err, result) => {
          if (err) {
            return res.status(400).json({
              ok: false,
              err,
            });
          }
        }
      );
    });

    // TABLA FACTURA
    var iva = total * 0.12;
    connection.query(
      "INSERT INTO FACTURAS SET?",
      {
        codigo_venta,
        subtotal: total - iva,
        descuento: 0,
        iva,
        total,
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
          codigo_venta,
        });
      }
    );



  });

  const datos_factura = (id_factura) => {
    return new Promise((resolve, reject) => {
      factura = "c";
      connection.query(
        `SELECT * FROM FACTURAS WHERE codigo_venta='${id_factura}'`,
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          factura = result.map((v) => Object.assign({}, v));
          factura = factura[0];
          resolve({
            factura,
          });
        }
      );
    });
  };

  const datos_detalle_ventas = (id_factura) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT nombre_celular, cantidad, precio_celular FROM DETALLE_VENTA, CELULARES WHERE codigo_venta='${id_factura}' AND DETALLE_VENTA.id_celular=CELULARES.id_celular`,
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          detalle_venta = result.map((v) => Object.assign({}, v));
          detalle_venta = detalle_venta;
          resolve({
            detalle_venta,
          });
        }
      );
    });
  };

  app.get("/consultar-factura", async (req, res) => {
    let id_factura = req.query.id_factura || 0;
    factura = "";
    detalle_venta = "";
    error = "";
    await datos_factura(id_factura)
      .then((data) => {
        factura = data;
      })
      .catch((err) => {
        error = err;
      });

    await datos_detalle_ventas(id_factura)
      .then((data) => {
        detalle_venta = data;
      })
      .catch((err) => {
        error = err;
      });

    if (error)
      return res.status(400).json({
        ok: false,
        error,
      });
    return res.json({
      ok: true,
      result: {
        factura: factura.factura,
        detalle_venta: detalle_venta.detalle_venta,
      },
    });
    //acaba
  });
};
