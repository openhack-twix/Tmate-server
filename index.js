const express = require("express");
const app = express();
const initRoom = require('./rooms');
const http = require("http").Server(app); //1

initRoom(http);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/client.html");
});

const port = process.env.PORT || 3000;
http.listen(port, function() {
  console.log(`Start listening on port ${port}`);
});
