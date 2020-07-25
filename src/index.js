const app = require("./config/server");

require("./app/routes/celulares.js")(app);
require("./app/routes/usuarios")(app);
require("./app/routes/clientes")(app);

// Start the server

try {
  app.listen(app.get("port"), () => {
    console.log("server on port", app.get("port"));
  });
} catch (error) {
  console.log("error") 
}

