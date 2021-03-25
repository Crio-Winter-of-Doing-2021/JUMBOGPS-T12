const User = require('../models/Users.js'); // User

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt.config');

function hashPassword(password) {
    return bcrypt.hashSync(password);
}

function checkPassword(input, password) {
    return bcrypt.compareSync(password, input);
}

// create a new user
exports.create = (req, res) => {

    // register an user    
    const user = new User({
        id: req.body.id,
        name: req.body.name,
        type: req.body.type,
        password: hashPassword(req.body.password)
    });

    // saving a new user to the database
    user.save()
    .then(data => {
        res.status(200).send({message: 'Added new user data'}); // sending back the new entry
    })
    .catch(err => {
        res.status(500).send({message: err.message || 'Some error in creating new user data'}); // error handling
    });
};

function getUserInfo(user) {
    return {
        id: user.id, name: user.name, type: user.type
    };
}

// find all users
exports.findAll = (req, res) => {
    User.find()
    .then(users => {                
        res.send(users.map(user => getUserInfo(user)));
    })
    .catch(err => {
        res.status(404).send({message: err.message || 'Some error in retrieving Users'});
    });
};

exports.authenticate = (req, res) => {
    User.findOne({id: req.body.id})
    .then(user => {                
        if (checkPassword(user.password, req.body.password)) {
            const token = jwt.sign({ 
                id: user.id,
                type: user.type
            }, jwtConfig.JWT_SECRET);
            res.status(200).send({ token: token});
        } else {
            res.status(401).send({ message: 'Invalid password'});
        }
    })
    .catch(err => {
        res.status(404).send({message: err.message || 'User ID does not exist'}); // error handling
    });
};

// find a specific user with id passed as parameter
exports.findOne = (req, res) => {
    try {
        const user = jwt.verify(req.headers.token, jwtConfig.JWT_SECRET);
        User.findOne({ id: user.id, type: user.type }) 
        .then(user => {
            
            res.status(200).send(getUserInfo(user));
        })
        .catch(err => {
            res.status(404).send({message: err.message || 'Some error in retrieving User'}); // error handling
        });
    } catch (error) {
        res.status(401).send({message: 'Unauthorized access'}); // error handling
    }
    
};

// find a specific user and remove it from the database
exports.deleteOne = (req, res) => {
    const reqId = req.query.id; // required reqId

    User.deleteOne({id: reqId})
    .then(() => {
        res.status(200).send({message: 'User with id ' + reqId + ' was deleted successfully'}); // success message
    })
    .catch(err => {
        res.status(404).send({message: err.message || 'Some error in deleting User'}); // error handling
    });
};

// find a specific user and update it 
exports.updateOne = (req, res) => {
    const reqId = req.query.id; // required id

    User.updateOne({id: reqId}, {$set: {type: req.body.type}})
    .then(transaction => {        
        res.status(200).send({message: 'Successfully updated User with id '+ reqId}); // update process info
    })
    .catch(err => {        
        res.status(404).send({message: err.message || 'Some error in updating User'}); // error handling
    });
};