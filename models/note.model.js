// const mongoose = require('mongoose');
//
// const NoteSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true,
//         minlength: 1,
//         trim: true
//     },
//     body : {
//         type: String,
//         minlength: 1,
//         trim: true
//     },
//     _userId: {
//         type: mongoose.Types.ObjectId,
//         required: true
//     }
// })
//
// const Note = mongoose.model('Note', NoteSchema);
//
// module.exports = Note;

// const mysql = require('mysql');
//
// // MySQL database connection
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'your_username',
//     password: 'your_password',
//     database: 'your_database'
// });
//
// connection.connect();

const connection = require('../helpers/db-connect')

// Note schema table creation
const createNoteTable = `
  CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`;

connection.query(createNoteTable, (err) => {
    if (err) throw err;
    console.log('Notes table created successfully');
});

// Note model
const Note = {};

// Instance method to save note
Note.save = (note, callback) => {
    connection.query('INSERT INTO notes SET ?', note, (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

module.exports = Note;
