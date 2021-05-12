var mysql = require('mysql');  
var con = mysql.createConnection({  
  host: "localhost",  
  user: "root",  
  password: "admin",
  database: "msgnaa"
});  
con.connect(function(err) {  
  if (err) throw err;  
  console.log("Connected!");  
});  
/*con.query("CREATE DATABASE nodeMedia", function (err, result) {  
    if (err) throw err;  
    console.log("Database created");  
});*/  

module.exports = con;