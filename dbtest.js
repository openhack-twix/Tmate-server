
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "10.10.2.150",
  user: "chan",
  password: "OpenHack2019!",
  port: 3306,
  database: "openhack2019"
});

connection.connect(err => {
  if (err) {
    console.log("error:", err);
  } else {
    console.log("success!");
  }
});

connection.query('insert into test (idtest) value (3)', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.', err);
});

connection.end();
