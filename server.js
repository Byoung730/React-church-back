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

app.delete("/api/remove-person/:id", (request, response) => {
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

app.delete("/api/remove-expense/:id", (request, response) => {
  let id = request.params.id;
  pool.connect((err, db, done) => {
    if (err) {
      return response.status(400).send(err);
    } else {
      db.query(
        "DELETE FROM expenses WHERE id = $1",
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

app.delete("/api/remove-income/:id", (request, response) => {
  let id = request.params.id;
  pool.connect((err, db, done) => {
    if (err) {
      return response.status(400).send(err);
    } else {
      db.query(
        "DELETE FROM income WHERE id = $1",
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
      console.log("Error1 --> Look: ", err);
      return response.status(400).send(err);
    } else {
      db.query("SELECT * FROM people", (err, table) => {
        done();
        if (err) {
          console.log("Error2 --> Look: ", err);
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

app.get("/expenses", (request, response) => {
  pool.connect((err, db, done) => {
    if (err) {
      console.log("Error1 --> Look: ", err);
      return response.status(400).send(err);
    } else {
      db.query("SELECT * FROM expenses", (err, table) => {
        done();
        if (err) {
          console.log("Error2 --> Look: ", err);
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

app.get("/income", (request, response) => {
  pool.connect((err, db, done) => {
    if (err) {
      console.log("Error1 --> Look: ", err);
      return response.status(400).send(err);
    } else {
      db.query("SELECT * FROM income", (err, table) => {
        done();
        if (err) {
          console.log("Error2 --> Look: ", err);
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

app.post("/api/new-expense", (request, response) => {
  const item = request.body.item;
  const description = request.body.description;
  const amount = request.body.amount;
  const date = request.body.date;
  const id = Math.random().toFixed(8);
  // let values = [item, description, amount, date, id];
  pool.connect((err, db, done) => {
    if (err) {
      return console.log(err);
    } else {
      db.query(
        "INSERT INTO expenses (item, description, amount, date, id) VALUES($1, $2, $3, $4, $5)",
        [item, description, amount, date, id],
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

app.post("/api/new-income", (request, response) => {
  const item = request.body.item;
  const description = request.body.description;
  const amount = request.body.amount;
  const date = request.body.date;
  const id = Math.random().toFixed(8);
  let values = [item, description, amount, date, id];
  pool.connect((err, db, done) => {
    if (err) {
      return console.log(err);
    } else {
      db.query(
        "INSERT INTO income (item, description, amount, date, id) VALUES($1, $2, $3, $4, $5)",
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

app.put("/api/expenses/:id", (request, response) => {
  const item = request.body.item;
  const description = request.body.description;
  const amount = request.body.amount;
  const date = request.body.date;
  const id = request.body.id;
  pool.connect((err, db, done) => {
    if (err) {
      return console.log(err);
    } else {
      db.query(
        "UPDATE expenses SET item=$1, description=$2, amount=$3, date=$4 WHERE id=$5",
        [item, description, amount, date, Number(id)],
        (err, table) => {
          done();
          if (err) {
            return response.status(400).send(err);
          } else {
            console.log("DATA UPDATED");
            response.status(201).send({ message: "Data updated!" });
          }
        }
      );
    }
  });
});

app.put("/api/income/:id", (request, response) => {
  const item = request.body.item;
  const description = request.body.description;
  const amount = request.body.amount;
  const date = request.body.date;
  const id = request.body.id;
  pool.connect((err, db, done) => {
    if (err) {
      return console.log(err);
    } else {
      db.query(
        "UPDATE income SET item=$1, description=$2, amount=$3, date=$4 WHERE id=$5",
        [item, description, amount, date, Number(id)],
        (err, table) => {
          done();
          if (err) {
            return response.status(400).send(err);
          } else {
            console.log("DATA UPDATED");
            response.status(201).send({ message: "Data updated!" });
          }
        }
      );
    }
  });
});

app.put("/api/people/:id", (request, response) => {
  const email = request.body.email;
  const name = request.body.name;
  const address = request.body.address;
  const phone = request.body.phone;
  const id = request.body.id;
  const date_joined = request.body.date_joined;
  pool.connect((err, db, done) => {
    if (err) {
      return console.log("1 - LOOK --> ", err);
    } else {
      db.query(
        "UPDATE people SET email=$1, name=$2, address=$3, phone=$4, date_joined=$5 WHERE id=$6",
        [email, name, address, phone, date_joined, Number(id)],
        (err, table) => {
          done();
          if (err) {
            console.log("2 - LOOK --> ", err);
            return response.status(400).send(err);
          } else {
            console.log("DATA UPDATED");
            response.status(201).send({ message: "Data updated!" });
          }
        }
      );
    }
  });
});

app.post("/api/new-people", (request, response) => {
  const email = request.body.email;
  const name = request.body.name;
  const address = request.body.address;
  const phone = request.body.phone;
  const id = Math.random().toFixed(8);
  const date_joined = request.body.date_joined;
  let values = [email, name, address, phone, id, date_joined];
  pool.connect((err, db, done) => {
    if (err) {
      console.log("Error1 --> Look: ", err);
      return console.log(err);
    } else {
      db.query(
        "INSERT INTO people (email, name, address, phone, id, date_joined) VALUES($1, $2, $3, $4, $5, $6)",
        [...values],
        (err, table) => {
          done();
          if (err) {
            console.log("Error2 --> Look: ", err);
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

app.listen(PORT, () => console.log("Listening on port " + PORT));
