const express = require("express");
const app = express();
const initRoom = require("./rooms");
const http = require("http").Server(app); //1
const mongoose = require('mongoose');
var helmet = require('helmet')
var session = require('express-session')
app.use(helmet());

app.use(express.static("./public"));
app.use(express.json());

initRoom(http);

require('./middlewares/auth')(app);
require('./middlewares/routes')(app);

if(!process.env.jwtKey){
  console.error('jwtKey is not defined');
  process.exit(1);
}

// database 연결
const dbUrl = "mongodb://localhost/tmate";

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useFindAndModify: false
  })
  
  .then(() => console.log("🔥 Connected to mongodb!",`[${dbUrl}]`))
  .catch(err => console.log(`☠️ Failed to connect to mongodb: [${dbUrl}]`, err.message));


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`start listening on port ${port}`);
});
