const mongoose = require('mongoose'); // mongoose

/*
User: {
    id: a unique id,
    name: user name,
    type: user type,
    password: password
}
*/

const UserSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { collection: 'users'});

module.exports = mongoose.model('User', UserSchema);