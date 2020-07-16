const app = require("./config/server");

require("./app/routes/celulares.js")(app);

// Start the server

try {
  app.listen(app.get("port"), () => {
    console.log("server on port", app.get("port"));
  });
} catch (error) {
  console.log("error") 
}

