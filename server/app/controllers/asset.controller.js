const Asset = require('../models/Assets.js'); // Asset

const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt.config');
const app=require('../../server');
const io=app.getSocketIo();
const clients = app.getAllclients

// create a new meme
exports.create = (req, res) => {
    try {
        const user = jwt.verify(req.headers.token, jwtConfig.JWT_SECRET);
        const asset = new Asset({
            id: req.body.id,
            name: req.body.name,
            type: req.body.type,
            route: {
                src: req.body.src.split(',').map(x => +x),
                dest: req.body.dest.split(',').map(x => +x),
                start: new Date(req.body.start),
                end: new Date(req.body.end)
            },
            location: {
                type: 'Point',
                coordinates: [{
                    ts: new Date(req.body.ts),
                    lat: req.body.lat,
                    long: req.body.long
                }]
            }
        });

        if (user.type !== 'Admin') throw 'Unauthorized access';
    
        // saving a new asset to the database
        asset.save()
        .then(data => {
            io.sockets.emit('broadcast',{ description: 'Sample message to all connected!'});
            res.status(200).send({message: `Added new asset data ${data.id}`}); // sending back the new entry
        })
        .catch(err => {
            res.status(500).send({message: err.message || 'Some error in creating Asset data'}); // error handling
        });
    } catch (error) {
        console.log(error);
        res.status(401).send({ message: 'Unauthorized access' });
    }
    // create a Asset

    
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
        src: asset.route.src,
        dest: asset.route.dest,
        coordinates: getLatestLocation(asset)
    };
}

// find all assets
exports.findAll = (req, res) => {
    try {
        const user = jwt.verify(req.headers.token, jwtConfig.JWT_SECRET);
        Asset.find()
        .then(assets => {     
            console.log("send all assets API")
            io.sockets.emit('broadcast',{ description: 'Sample message to all connected!'});           
            res.send(assets.map(asset => getAssetInfo(asset)));
        })
        .catch(err => {
            res.status(404).send({message: err.message || 'Some error in retrieving Assets'});
        });
    } catch (error) {
        console.log(error);
        res.status(401).send({ message: 'Unauthorized access' });
    }
 
};

// find a specific asset with id passed as parameter
exports.findOne = (req, res) => {       

    try {
        const user = jwt.verify(req.headers.token, jwtConfig.JWT_SECRET);
        Asset.find({id: req.query.id}) 
        .then(asset => {
            res.status(200).send(asset);
        })
        .catch(err => {
            res.status(404).send({message: err.message || 'Some error in retrieving Asset'}); // error handling
        });    
    } catch (error) {
        console.log(error);
        res.status(401).send({ message: 'Unauthorized access' });
    }
};

// filter results based on search parameters
exports.filterAsset = (req, res) => {
    var id, type, start, end;
    if (req.query.id) id = req.query.id;        
    if (req.query.type) type = req.query.type;
    
    if (req.query.start) start = new Date(req.query.start);
    if (req.query.end) end = new Date(req.query.end);
    
    Asset.find({$or: [{id: id}, {type: type}, {start: start}, {end: end}, {start: start, end: end}]})
    .then(asset => {
        res.status(200).send(asset);
    })
    .catch(err => {
        res.status(404).send({ message: err.message || 'Asset not found' });
    });
};

function inRange(coords, start, end) {
    return (coords.ts >= start && coords.ts <= end);
}

function getCoordsInRange(asset, start, end) {
    let coords = [];
    for (var i = 0; i < asset.location.coordinates.length; i++) {
        if (inRange(asset.location.coordinates[i], start, end)) {
            coords.push(asset.location.coordinates[i]);
        }
    }
    console.log(coords);
    var info = getAssetInfo(asset);
    info.coordinates = coords;
    console.log(info);
    return info;
}

function filterCoords(assets, start, end) {
    return assets.map(asset => getCoordsInRange(asset, start, end));
}

exports.timeFilterAsset = (req, res) => {
    var start, end;
    
    if (req.query.start) start = new Date(req.query.start);
    if (req.query.end) end = new Date(req.query.end);

    console.log(start);
    console.log(end);
    
    Asset.find()
    .then(assets => {
        res.status(200).send(filterCoords(assets, start, end));
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
    // io.sockets.emit('broadcast',{ description: 'Sample message to all connected!'});

    Asset.updateOne({id: reqId}, {$push: {'location.coordinates': [
        {ts: new Date(req.body.ts), lat: +req.body.lat, long: +req.body.long}
    ]}})
    .then(transaction => {
        console.log(clients);
        Object.keys(clients).forEach((client)=>{
            console.log(reqId);
            if(clients[client].timelineView){
                console.log("came here")
                if(clients[client].assetID ===reqId){

                    Asset.find({id: reqId}) 
                    .then(asset => {
                        console.log("here");
                        io.to(client).emit('updated-location-details', {data:asset})
                    })
                    .catch(err => {
                       console.log(err);
                    });    
    

                }

            }
        })
        res.status(200).send({message: 'Successfully updated Asset with id '+ reqId}); // update process info
    })
    .catch(err => {        
        res.status(404).send({message: err.message || 'Some error in updating Asset'}); // error handling
    });
};

