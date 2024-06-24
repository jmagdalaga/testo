const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

// Synchronize the database
db.sequelize.sync({ force: true })
  .then(() => {
    console.log("Drop and re-sync db.");
  })
  .catch((err) => {
    console.error("Failed to sync db:", err.message);
    console.error(err); // Log the full error object for more details
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./app/routes/tutorial.routes")(app); // Ensure this path is correct

// set port, listen for requests
const PORT = process.env.PORT || 5342;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
