const mongoose = require("mongoose");
const logger = require("../logger");

module.exports = function() {
  const dbUrl = process.env.DB_URL || "mongodb://localhost/tmatet";

  mongoose.set("useNewUrlParser", true);
  mongoose.set("useFindAndModify", false);
  mongoose.set("useCreateIndex", true);
  mongoose
    .connect(dbUrl)
    .then(() => logger.info("🔥 Connected to mongodb!", `[${dbUrl}]`))
    .catch(err =>
      logger.info(`☠️ Failed to connect to mongodb: [${dbUrl}]`, err.message)
    );
};
