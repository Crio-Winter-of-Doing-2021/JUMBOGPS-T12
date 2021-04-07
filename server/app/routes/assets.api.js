const express = require('express');
const router = express.Router(); // controls routes for the url

const assetController = require('../controllers/asset.controller.js');

// mandatory routes

// get assets data
router.get('/', async (req, res) => {
    if (req.query.id) {
        assetController.findOne(req, res); // restricted
    } else {
        assetController.findAll(req, res); // restricted
    }    
});

// add a asset to db
router.post('/', async (req, res) => {
    assetController.create(req, res); // admin restricted
});

// optional routes

// delete asset
router.delete('/', async (req, res) => {
    assetController.deleteOne(req, res); // admin restricted
});

// update a asset
router.patch('/', async (req, res) => {    
    assetController.updateOne(req, res);
});

router.get('/filter', async (req, res) => {
    assetController.filterAsset(req, res);
});

router.get('/filter/time', async (req, res) => {
    assetController.timeFilterAsset(req, res);
});

router.put('/geofence', async (req, res)=>{
    assetController.addGeoFence(req,res);
})

module.exports = router;