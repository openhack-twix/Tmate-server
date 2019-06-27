const connection = require("./connection");


function talk(uSeq, roomId, message){
  return new Promise((resolve, reject) => {
    connection.query(
      "insert into chat (u_seq,p_seq,msg,time) value (?, ?, ?, now());",
      [uSeq, roomId, message],
      (err, result) => {
        if (err) {
          return reject(err);
        }

        resolve(result.affectedRows);
      }
    );
  });
}

function getTalks(roomId) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM post where p_seq=?",
      [roomId],
      (err, result) => {
        if (err) {
          return reject(err);
        }

        resolve(result);
      }
    );
  });
}

function createRoom(city, lat, lon, title, content, userId, due) {
  return new Promise((resolve, reject) => {
    connection.query(
      "insert into POST (title, content, city, lat, lon, u_seq, due) values (?,?,?,?,?,?,?)",
      [title, content, city, lat, lon, userId, due],
      (err, result) => {
        console.log(err);
        if (err) {
          return reject(err);
        }

        resolve(result.insertId);
      }
    );
  });
}

function getRooms() {
  return new Promise((resolve, reject) => {
    connection.query("select * from POST;", function(err, rows, fields) {
      if (err) {
        console.log("Error while performing Query.", err);
        reject(err);
      }

      resolve(rows);
    });
  });
}

function getLocalRooms(city) {
  return new Promise((resolve, reject) => {
    connection.query("select * from POST where city = ?;", [city], function(
      err,
      rows,
      fields
    ) {
      if (err) {
        console.log("Error while performing Query.", err);
        reject(err);
      }

      resolve(rows);
    });
  });
}

module.exports = {
  getLocalRooms,
  createRoom,
  getTalks,
  talk,
  getRooms
};
