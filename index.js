const express = require("express");
const app = express();
const initRoom = require("./rooms");
const http = require("http");
const server = http.createServer(app);
const mongoose = require('mongoose');
var helmet = require('helmet')
app.use(helmet());

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("./"));
app.use(express.json());

initRoom(server);

require('./middlewares/routes')(app);

if(!process.env.jwtKey){
  console.error('jwtKey is not defined');
  process.exit(1);
}

// database 연결
const dbUrl = "mongodb://localhost/tmatet";

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useFindAndModify: false
  })
  
  .then(() => console.log("🔥 Connected to mongodb!",`[${dbUrl}]`))
  .catch(err => console.log(`☠️ Failed to connect to mongodb: [${dbUrl}]`, err.message));


const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`start listening on port ${port}`);
});
