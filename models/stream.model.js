var sql = require('../database/connection');

//Task object constructor
var Stream = function(streams){
    this.stream = streams;
};

Stream.createStream = function (newStream, result) {    
        sql.query("INSERT INTO streams set ?", newStream.stream, function (err, res) {
                
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else{
                    //console.log(res.insertId);
                    result(null, res.insertId);
                    //res.send('/tasks')
                }
            });          
};
Stream.getStreamById = function (streamId, result) {
        sql.query("Select stream from streams where id = ? ", streamId, function (err, res) {             
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else{
                    result(null, res);
              
                }
            });   
};

/* Stream.getStreamByName = function (streamName, result) {
    sql.query("Select id from streams where name like ? ", '%' + streamName + '%', function (err, res) {             
            if(err) {
                console.log("error: ", err);
                result(err, null);
            }
            else{
                result(null, res);          
            }
        });   
}; */

Stream.getStreamByName = function (streamName, result) {
    sql.query("Select id from streams where name = ? ", streamName, function (err, res) {             
            if(err) {
                console.log("error: ", err);
                result(err, null);
            }
            else{
                result(null, res);          
            }
        });   
};

Stream.getAllStream = function (result) {
        sql.query("Select * from streams", function (err, res) {

                if(err) {
                    console.log("error: ", err);
                    result(null, err);
                }
                else{
                    result(null, res);
                }
            });   
};
Stream.updateById = function(id, stream, result){
  sql.query("UPDATE streams SET stream = ? WHERE id = ?", [stream.stream, id], function (err, res) {
          if(err) {
              console.log("error: ", err);
                result(null, err);
             }
           else{   
             result(null, res);
                }
            }); 
};

Stream.updatePathById = function(id, stream, result){
    console.log("ID = ", id);
    console.log("Stream = ", stream);

    sql.query("UPDATE streams SET path = ? WHERE id = ?", [stream, id], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{   
            result(null, res);
        }
    });2
    3
};

Stream.remove = function(id, result){
     sql.query("DELETE FROM streams WHERE id = ?", [id], function (err, res) {

                if(err) {
                    console.log("error: ", err);
                    result(null, err);
                }
                else{               
                    result(null, res);
                }
            }); 
};

module.exports= Stream;