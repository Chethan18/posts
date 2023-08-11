const sqlite3 = require('sqlite3').verbose();

const postsDB = new sqlite3.Database("./posts.db",sqlite3.OPEN_READWRITE,(err)=>{
  if(err)
    return console.error(err.message);

})

let sql;
sql = `CREATE TABLE if not exists posts(id VARCHAR2 PRIMARY KEY,name, content, user_id, dateTime)`;
postsDB.run(sql);

sql = `CREATE TABLE if not exists replies(id VARCHAR2 PRIMARY KEY,postId, name, content, user_id, dateTime)`;
postsDB.run(sql);

module.exports = postsDB;