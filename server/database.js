var mysql = require('mysql');

var db_config = require('./config/databaseConfig.js');
module.exports = {
    query : function(sql,params,callback){
        var connection = mysql.createConnection(db_config);
        connection.connect(function(err){
            if(err){
                console.log('Database connection failed');
                throw err;
            }
        connection.query( sql, params, function(err,results,fields ){
           if(err){
                console.log('Already exsist');
            }
            callback && callback(results, fields);
             connection.end(function(err){
                  if(err){
                      console.log('Close database failed');
                      throw err;
                  }
              });
           });
       });
    }
};
