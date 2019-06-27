const express = require("express");
const app = express();
const initRoom = require("./rooms");
const http = require("http").Server(app); //1
const mongoose = require('mongoose');

initRoom(http);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/client.html");
});

// database 연결
const dbUrl = "mongodb://localhost/tmate";

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(() => console.log("🔥 Connected to mongodb!", `[${dbUrl}]`))
  .catch(err =>
    console.log(`☠️ Failed to connect to mongodb: [${dbUrl}]`, err.message)
  );

const port = process.env.PORT || 3000;
http.listen(port, function() {
  console.log(`Start listening on port ${port}`);
});
