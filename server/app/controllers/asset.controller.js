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
            coordinates: [{
                ts: req.body.ts,
                lat: req.body.lat,
                long: req.body.long
            }]
        }
    });

    // console.log(asset.route.start.getHours());
    // console.log(asset.route.end.getMinutes());

    // saving a new asset to the database
    asset.save()
    .then(data => {
        res.status(200).send({message: 'Added new asset data'}); // sending back the new entry
    })
    .catch(err => {
        res.status(500).send({message: err.message || 'Some error in creating Asset data'}); // error handling
    });
    // res.send({ message: "ok" });
};

function getLatestLocation(asset) {
    var locs = asset.location.coordinates.length;
    return asset.location.coordinates[locs-1];
}

function getAssetInfo(asset) {
    return {
        id: asset.id,
        type: asset.type,
        name: asset.name,
        coordinates: getLatestLocation(asset)
    };
}

// find all assets
exports.findAll = (req, res) => {
    Asset.find()
    .then(assets => {                
        res.send(assets.map(asset => getAssetInfo(asset)));
    })
    .catch(err => {
        res.status(404).send({message: err.message || 'Some error in retrieving Assets'});
    });
};

// find a specific asset with id passed as parameter
exports.findOne = (req, res) => {       
    
    Asset.find({id: req.query.id}) 
    .then(asset => {
        res.status(200).send(asset);
    })
    .catch(err => {
        res.status(404).send({message: err.message || 'Some error in retrieving Asset'}); // error handling
    });
};

// filter results based on search parameters
exports.filterAsset = (req, res) => {
    var id, type, start, end;
    if (req.query.id) id = req.query.id;        
    if (req.query.type) type = req.query.type;
    if (req.query.start) start = Date(req.query.start);
    if (req.query.end) end = Date(req.query.end);
    
    Asset.find({$or: [{id: id}, {type: type}, {start: start}, {end: end}, {start: start, end: end}]})
    .then(asset => {
        res.status(200).send(asset);
    })
    .catch(err => {
        res.status(404).send({ message: err.message || 'Asset not found' });
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

    Asset.updateOne({id: reqId}, {$push: {'location.coordinates': [
        {ts: Date(req.body.ts), lat: +req.body.lat, long: +req.body.long}
    ]}})
    .then(transaction => {        
        res.status(200).send({message: 'Successfully updated Asset with id '+ reqId}); // update process info
    })
    .catch(err => {        
        res.status(404).send({message: err.message || 'Some error in updating Asset'}); // error handling
    });
};