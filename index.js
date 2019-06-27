const express = require("express");
const app = express();
const initRoom = require("./rooms");
const http = require("http").Server(app); //1
const mongoose = require('mongoose');

<<<<<<< HEAD
const mongoose = require('mongoose');

app.use(express.json());

require('./middlewares/routes')(app);

if(!process.env.jwtKey){
  console.error('jwtKey is not defined');
  process.exit(1);
}

// database 연결
const dbUrl = 'mongodb://localhost/tmate';
  // process.env.NODE_ENV === "production"
  //   ? config.get("database.url")
  //   : "mongodb://localhost/tmate";
=======
initRoom(http);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/client.html");
});

// database 연결
const dbUrl = "mongodb://localhost/tmate";
>>>>>>> feat/room

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useFindAndModify: false
  })
<<<<<<< HEAD
  .then(() => console.log("🔥 Connected to mongodb!",`[${dbUrl}]`))
  .catch(err => console.log(`☠️ Failed to connect to mongodb: [${dbUrl}]`, err.message));


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`start listening on port ${port}`);
=======
  .then(() => console.log("🔥 Connected to mongodb!", `[${dbUrl}]`))
  .catch(err =>
    console.log(`☠️ Failed to connect to mongodb: [${dbUrl}]`, err.message)
  );

const port = process.env.PORT || 3000;
http.listen(port, function() {
  console.log(`Start listening on port ${port}`);
>>>>>>> feat/room
});
