const express = require('express');
const router = express.Router(); // controls routes for the url

const userController = require('../controllers/user.controller.js');

// mandatory routes

// get users data
router.get('/', async (req, res) => {
    if (req.query.id) {
        userController.findOne(req, res);
    } else {
        userController.findAll(req, res);
    }    
});

router.get('/login', async (req, res) => {
    userController.authenticate(req, res);
});

// add a user to db
router.post('/register', async (req, res) => {
    userController.create(req, res);
});

// optional routes

// delete user
router.delete('/', async (req, res) => {
    userController.deleteOne(req, res);
});

// update a user
router.patch('/', async (req, res) => {
    console.log(req.query.id);
    userController.updateOne(req, res);
});

module.exports = router;