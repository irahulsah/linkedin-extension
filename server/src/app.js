const cors = require("cors");
const express = require("express");
require("dotenv/config");

const { connectDb } = require("./DbConnection/dbConnection");
const routes = require("./routes");

const app = express();

// Third-Party Middleware

app.use(cors());

// Built-In Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// * Routes * //

app.use("/api/v1/monday-task", routes.mondyTaskRoute);


connectDb().then(async () => {
  app.listen(process.env.PORT, () =>
    console.log(`app listening on port ${process.env.PORT}!`)
  );
});
