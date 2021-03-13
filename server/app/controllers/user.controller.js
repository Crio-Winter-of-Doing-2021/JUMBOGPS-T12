const User = require('../models/Users.js'); // User

// create a new user
exports.create = (req, res) => {

    // register an user
    const user = new User({
        id: req.body.id,
        name: req.body.name,
        type: req.body.type,
        password: req.body.password
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

// find all users
exports.findAll = (req, res) => {
    User.find()
    .then(users => {                
        res.send(users);
    })
    .catch(err => {
        res.status(404).send({message: err.message || 'Some error in retrieving Users'});
    });
};

// find a specific user with id passed as parameter
exports.findOne = (req, res) => {
    const reqId = req.query.id; // required id    
    User.find({id: reqId}) 
    .then(user => {
        res.status(200).send(user);
    })
    .catch(err => {
        res.status(404).send({message: err.message || 'Some error in retrieving User'}); // error handling
    });
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