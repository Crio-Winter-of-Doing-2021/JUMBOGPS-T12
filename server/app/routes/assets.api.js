const express = require('express');
const router = express.Router(); // controls routes for the url

const assetController = require('../controllers/asset.controller.js');

// mandatory routes

// get assets data
router.get('/', async (req, res) => {
    if (req.query.id) {
        assetController.findOne(req, res);
    } else {
        assetController.findAll(req, res);
    }    
});

// add a asset to db
router.post('/', async (req, res) => {
    assetController.create(req, res);
});

// optional routes

// delete asset
router.delete('/', async (req, res) => {
    assetController.deleteOne(req, res);
});

// update a asset
router.patch('/', async (req, res) => {
    console.log(req.query.id);
    assetController.updateOne(req, res);
});

module.exports = router;