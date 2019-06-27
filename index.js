const logger = require('./logger');
const express = require("express");
const app = express();
const initRoom = require("./rooms");
const http = require("http");
const server = http.createServer(app);
const mongoose = require('mongoose');
const helmet = require('helmet')
app.use(helmet());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("./"));
app.use(express.json());

initRoom(server);

require('./middlewares/routes')(app);

// if(!process.env.jwtKey){
//   console.error('jwtKey is not defined');
//   process.exit(1);
// }

// database 연결
const dbUrl = process.env.DB_URL || "mongodb://localhost/tmatet";

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useFindAndModify: false
  })
  
  .then(() => logger.info("🔥 Connected to mongodb!",`[${dbUrl}]`))
  .catch(err => logger.info(`☠️ Failed to connect to mongodb: [${dbUrl}]`, err.message));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  logger.info(`🌈 start listening on port ${port}`);
});
