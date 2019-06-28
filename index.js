const logger = require("./logger");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const helmet = require("helmet");
app.use(helmet());

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("./"));
app.use(express.json());

require("./rooms")(server);
require("./middlewares/routes")(app);
require('./db')();

const port = process.env.PORT || 3000;
server.listen(port, () => {
  logger.info(`🌈 start listening on port ${port}`);
});

logger.info("💩  O 🔥️  P 🌈  E 😜  N ⭐  H ❌  A 🐕  C 👅  K 🌸")
