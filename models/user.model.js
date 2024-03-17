// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const _ = require('lodash');
// const crypto = require('crypto');
//
// const JWT_SECRET = 'sQSwHVGTfGPBsdkfjslD4ExFUcL238374qn4sqakZZX';
//
// const UserSchema = mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         minlength: 2,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         minlength: 5,
//         trim: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 8
//     },
//     sessions: [{
//         token: {
//             type: String,
//             required: true
//         },
//         expiresAt: {
//             type: Number,
//             required: true
//         }
//     }]
// })
//
// /**
//  * INSTANCE METHODS
//  *  -> methods that are run on instances of the user model
//  *  -> they are called on user objects
//  */
//
// UserSchema.methods.toJSON = function() {
//     const user = this;
//     const userObject = user.toObject();
//
//     // return the document except the password and sessions
//     // as these shouldn't be made available
//     return _.omit(userObject, ['password', 'sessions']);
// }
//
// UserSchema.methods.generateAccessToken = function() {
//     const user = this;
//     return new Promise((resolve, reject) => {
//         // Create the JSON Web Token and return it
//         jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '15m' }, (err, token) => {
//             if (err) return reject();
//
//             resolve(token);
//         })
//     })
// }
//
//
// UserSchema.methods.generateRefreshToken = function() {
//     // this method will return a 64byte hex string
//     // this is all it does, it won't save it to the database
//     return new Promise((resolve, reject) => {
//         crypto.randomBytes(64, (err, buf) => {
//             if (!err) {
//                 // there was no error
//                 let token = buf.toString('hex');
//
//                 return resolve(token);
//             }
//         })
//     })
// }
//
// UserSchema.methods.createSession = function() {
//     const user = this;
//
//     return user.generateRefreshToken().then((refreshToken) => {
//         return saveSessionToDB(user, refreshToken);
//     }).then((refreshToken) => {
//         // saved to DB successfully
//         // now return the refresh token;
//         return refreshToken;
//     }).catch(e => {
//         return Promise.reject('Failed to save session to database.\n' + e);
//     })
// }
//
//
// /**
//  * MODEL (STATIC) METHODS
//  *  -> methods that are run on the Model itself and not instances
//  */
//
// UserSchema.statics.getJWTSecret = () => {
//     return JWT_SECRET;
// }
//
// UserSchema.statics.findByIdAndToken = function(_id, token) {
//     // finds user by id and token
//     // this will be used in authentication middleware
//
//     const User = this;
//
//     return User.findOne({
//         _id,
//         'sessions.token': token
//     });
// }
//
//
// UserSchema.statics.findByCredentials = function(email, password) {
//     const User = this;
//     return User.findOne({ email }).then((user) => {
//         // check whether the user has been found
//         if (!user) return Promise.reject();
//
//         return new Promise((resolve, reject) => {
//             bcrypt.compare(password, user.password, (err, success) => {
//                 if (success) {
//                     // the comparison was successful, so the password is correct
//                     resolve(user);
//                 } else{
//                     // the comparison was not successful
//                     reject();
//                 }
//             })
//         })
//     });
// }
//
//
// UserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
//     let currentDateTime = Date.now() / 1000;
//     if (expiresAt > currentDateTime) {
//         // hasn't expired
//         return false;
//     } else {
//         // has expired
//         return true;
//     }
// }
//
//
// /**
//  * Middleware
//  */
// UserSchema.pre('save', function(next) {
//     const user = this;
//     const costFactor = 10;
//
//     if (user.isModified('password')) {
//         // the password filed has been edited/changed
//
//         // hash and salt the password before saving to the database
//         bcrypt.genSalt(costFactor, (err, salt) => {
//             // salt has been generated - now we just have to hash the password
//             bcrypt.hash(user.password, salt, (err, hash) => {
//                 user.password = hash;
//                 next();
//             })
//         })
//     } else {
//         next();
//     }
// })
//
//
//
// /**
//  * Helper methods
//  */
//
// const saveSessionToDB = (user, refreshToken) => {
//     // Save the session to the database
//     return new Promise((resolve, reject) => {
//         let expiresAt = generateRefreshTokenExpiryTime();
//
//         user.sessions.push({
//             token: refreshToken,
//             expiresAt
//         })
//
//         user.save().then(() => {
//             // session was successfully saved
//             return resolve(refreshToken);
//         }).catch(e => {
//             reject(e);
//         })
//     })
// }
//
// const generateRefreshTokenExpiryTime = () => {
//     const daysUntilExpire = 10;
//     const secondsUntilExpire = ((daysUntilExpire * 24) * 60) * 60;
//     return ((Date.now() / 1000) + secondsUntilExpire);
// }
//
//
//
// const User = mongoose.model('User', UserSchema);
// module.exports = User;


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const crypto = require('crypto');

// Import MySQL connection
const connection = require('../helpers/db-connect');

// JWT secret
const JWT_SECRET = 'sQSwHVGTfGPBsdkfjslD4ExFUcL238374qn4sqakZZX';

class User {

    constructor(user) {
        this.user = user
    }
    // Instance method to convert user object to JSON
    static toJSON(user) {
        const userObject = user;
        return _.omit(userObject, ['password', 'sessions']);
    }

    // Instance method to generate access token
    static generateAccessToken(user) {
        return new Promise((resolve, reject) => {
            jwt.sign({ _id: user.id }, JWT_SECRET, { expiresIn: '15m' }, (err, token) => {
                if (err) return reject(err);
                resolve(token);
            });
        });
    }

    // Instance method to generate refresh token
    static generateRefreshToken() {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(64, (err, buf) => {
                if (err) return reject(err);
                const refreshToken = buf.toString('hex');
                resolve(refreshToken);
            });
        });
    }

    // Instance method to create session
    static createSession(user) {
        console.log(user)
        return this.generateRefreshToken().then((refreshToken) => {
            return this.saveSessionToDB(user, refreshToken);
        }).then((refreshToken) => {
            return refreshToken;
        }).catch(e => {
            return Promise.reject('Failed to save session to database.\n' + e);
        });
    }

    // Static method to get JWT secret
    static getJWTSecret() {
        return JWT_SECRET;
    }

    // Static method to find user by id and token
    static findByIdAndToken(_id, token) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM users WHERE _id = ? AND sessions.token = ?', [_id, token], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve(null);
                resolve(results[0]);
            });
        });
    }

    // Static method to find user by credentials
    static findByCredentials(email, password) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return reject('User not found');

                const user = results[0];
                bcrypt.compare(password, user.password, (err, success) => {
                    if (err) return reject(err);
                    if (success) {
                        resolve(user);
                    } else {
                        console.log(err)
                        reject('Incorrect password');
                    }
                });
            });
        });
    }

    // Static method to check if refresh token has expired
    static hasRefreshTokenExpired(expiresAt) {
        const currentDateTime = Date.now() / 1000;
        return expiresAt <= currentDateTime;
    }

    // Middleware to hash and salt the password before saving
    static hashPassword(user) {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) return reject(err);
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if (err) return reject(err);
                    user.password = hash;
                    resolve(user);
                });
            });
        });
    }

    // Helper method to save session to database
    static saveSessionToDB(user, refreshToken) {
        return new Promise((resolve, reject) => {
            const expiresAt = this.generateRefreshTokenExpiryTime();
            const session = {
                token: refreshToken,
                expiresAt: expiresAt
            };

            connection.query('UPDATE users SET sessions = JSON_ARRAY_APPEND(sessions, \'$\', ?) WHERE id = ?', [JSON.stringify(session), user.id], (err, result) => {
                if (err) return reject(err);
                resolve(refreshToken);
            });
        });
    }

    // Helper method to generate refresh token expiry time
    static generateRefreshTokenExpiryTime() {
        const daysUntilExpire = 10;
        const secondsUntilExpire = daysUntilExpire * 24 * 60 * 60;
        return Math.floor(Date.now() / 1000) + secondsUntilExpire;
    }

    // Static method to save user to database
    async save(user) {
        return new Promise((resolve, reject) => {
            // Hash the password before saving
            bcrypt.hash(user.password, 10, (err, hash) => {
                if (err) return reject(err);
                user.password = hash;
                const query = 'INSERT INTO users SET ?';
                connection.query(query, user, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        });
    }
}

module.exports = User;
