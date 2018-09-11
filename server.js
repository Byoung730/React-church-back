const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const Pool = require("pg-pool");
const PORT = 3001;
const app = express();
const cors = require("cors");

app.use(cors());

const pool = new Pool({
  port: 5432,
  user: "evrvj",
  password: "gangster",
  database: "church",
  max: 10,
  host: "localhost"
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.delete("/api/remove/:id", (request, response) => {
  let id = request.params.id;
  pool.connect((err, db, done) => {
    if (err) {
      return response.status(400).send(err);
    } else {
      db.query(
        "DELETE FROM people WHERE id = $1",
        [Number(id)],
        (err, result) => {
          done();
          if (err) {
            return response.status(400).send(err);
          } else {
            return response.status(200).send({ message: "success" });
          }
        }
      );
    }
  });
});

app.get("/people", (request, response) => {
  pool.connect((err, db, done) => {
    if (err) {
      return response.status(400).send(err);
    } else {
      db.query("SELECT * FROM people", (err, table) => {
        done();
        if (err) {
          return response.status(400).send(err);
        } else {
          console.log("DATA RETRIEVED");
          db.end();
          response.status(200).send(table.rows);
        }
      });
    }
  });
});

app.post("/api/new-people", (request, response) => {
  const email = request.body.email;
  const first_name = request.body.first_name;
  const last_name = request.body.last_name;
  const id = Math.random().toFixed(4);
  let values = [email, first_name, last_name, id];
  pool.connect((err, db, done) => {
    if (err) {
      return console.log(err);
    } else {
      db.query(
        "INSERT INTO people (email, first_name, last_name, id) VALUES($1, $2, $3, $4)",
        [...values],
        (err, table) => {
          done();
          if (err) {
            return response.status(400).send(err);
          } else {
            console.log("DATA INSERTED");
            response.status(201).send({ message: "Data inserted!" });
          }
        }
      );
    }
  });
});

// app.post("/api/new-people", (request, response) => {
//   console.log(request.body);
//   response.send("what");
// });

app.listen(PORT, () => console.log("Listening on port " + PORT));
