const connection = require("./connection");

function getAuthorized(id){
  return new Promise((resolve,reject)=>{
    connection.query('select * from user where id=?;', [id], function(err,result){
      if(err) reject(err);
      resolve(result);
    });
  })
}

function getUser(username){
  return new Promise((resolve,reject)=>{
    connection.query('select * from user where name=?;', [username], function(err,result){
      if(err) reject(err);
      resolve(result[0]);
    });
  })
}

function setAuthorized(oauthId, name, SNS, email,color) {
  return new Promise((resolve, reject) => {
    console.log('set authorized!!!!')
    connection.query(
      "INSERT INTO user (OAUTHID, NAME,SNS,EMAIL,COLOR) VALUES (?,?,?,?,?);",
      [oauthId, name, SNS, email,color],
      function(err, result, fields) {
        if (!err) {
          return resolve(result.insertId);
        }
        else {
          console.log("Error while performing Query.", err);
          return reject(err);
        }
      }
    );
  });
}

function unsetAuthorized(oauthId) {
  return new Promise((resolve, reject)=>{
    connection.query(
      'delete from user where oauthid=?',
      [oauthId],
      function(err, result){
        if(!err){
          resolve(result.affectedRows);
        }else {
          return reject(err);
        }
      }
    );
  })
}

module.exports = {
  setAuthorized,
  getAuthorized,
  unsetAuthorized,
  getUser
};
