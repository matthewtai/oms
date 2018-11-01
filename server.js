const express = require("express");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/api/alphaApi");
//const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 3001;
var db = require("./models");
// Define middleware here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Add routes, both API and view
//app.use(routes);
require("./routes/api/users")(app);
require("./routes/api/portfolios")(app);
require("./routes/api/stages")(app);
require("./routes/api/login")(app);
// require("./routes/api/alphaApi")(app);
//require("./routes/htmlRoutes")(app);
app.use("/api", apiRoutes);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT,function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

// Start the API server
/*
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
*/