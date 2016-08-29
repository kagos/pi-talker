var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('pi-talker.db');

db.serialize(function() {

  db.run("CREATE TABLE if not exists utilities (name TEXT, pyScriptOnPath TEXT, pyScriptOffPath TEXT, defaultValue 0, dateCreated DATE)");

  var stmt = db.prepare("INSERT INTO utilities VALUES (?,?,?,?," + new Date() + ")");

  stmt.finalize();

});

db.close();
