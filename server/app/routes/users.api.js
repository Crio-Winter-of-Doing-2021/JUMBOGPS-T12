const express = require('express');
const router = express.Router(); // controls routes for the url

const userController = require('../controllers/user.controller.js');

// mandatory routes

// get users data
router.get('/', async (req, res) => {    
    userController.findOne(req, res); // restricted
});

router.get('/all-users', async (req, res) => {
    userController.findAll(req, res); // restricted
});

router.post('/login', async (req, res) => {
    userController.authenticate(req, res);
});

// add a user to db
router.post('/register', async (req, res) => {
    userController.create(req, res); // restricted
});

// optional routes

// delete user
router.delete('/', async (req, res) => {
    userController.deleteOne(req, res); // restricted
});

// update a user
router.patch('/', async (req, res) => {    
    userController.updateOne(req, res); // restricted
});

module.exports = router;