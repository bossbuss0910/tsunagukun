var mysqlModel = require('mysql');

var connection = mysqlModel.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'com_up_app',
});

module.exports = connection;
 
