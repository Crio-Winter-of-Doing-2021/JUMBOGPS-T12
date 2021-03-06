const Asset = require('../models/Assets.js'); // Asset

// create a new meme
exports.create = (req, res) => {

    // create a Asset
    const asset = new Asset({
        id: req.body.id,
        name: req.body.name,
        type: req.body.type,
        route: {
            src: req.body.src,
            dest: req.body.dest,
            start: req.body.start,
            end: req.body.end
        },
        location: {
            type: 'Point',
            coordinates: [[+req.body.long, +req.body.lat]]
        }
    });

    // saving a new asset to the database
    asset.save()
    .then(data => {
        res.status(200).send({message: 'Added new asset data'}); // sending back the new entry
    })
    .catch(err => {
        res.status(500).send({message: err.message || 'Some error in creating Asset data'}); // error handling
    });
};

// find all assets
exports.findAll = (req, res) => {
    Asset.find()
    .then(assets => {                
        res.send(assets);
    })
    .catch(err => {
        res.status(404).send({message: err.message || 'Some error in retrieving Assets'});
    });
};

// find a specific asset with id passed as parameter
exports.findOne = (req, res) => {
    const reqId = req.query.id; // required id    
    Asset.find({id: reqId}) 
    .then(asset => {
        res.status(200).send(asset);
    })
    .catch(err => {
        res.status(404).send({message: err.message || 'Some error in retrieving Asset'}); // error handling
    });
};


// find a specific asset and remove it from the database
exports.deleteOne = (req, res) => {
    const reqId = req.query.id; // required reqId

    Asset.deleteOne({id: reqId})
    .then(() => {
        res.status(200).send({message: 'Asset with id ' + reqId + ' was deleted successfully'}); // success message
    })
    .catch(err => {
        res.status(404).send({message: err.message || 'Some error in deleting Asset'}); // error handling
    });
};

// find a specific asset and update it 
exports.updateOne = (req, res) => {
    const reqId = req.query.id; // required id

    Asset.updateOne({id: reqId}, {$push: {'location.coordinates': [+req.body.long, +req.body.lat]}})
    .then(transaction => {        
        res.status(200).send({message: 'Successfully updated Asset with id '+ reqId}); // update process info
    })
    .catch(err => {        
        res.status(404).send({message: err.message || 'Some error in updating Asset'}); // error handling
    });
};