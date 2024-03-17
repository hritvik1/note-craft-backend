const mysql = require('mysql');

// MySQL database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'hritvik',
    password: 'hritvikM',
    database: 'mytest'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

module.exports = connection;
