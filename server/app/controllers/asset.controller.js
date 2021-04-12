const Asset = require('../models/Assets.js'); // Asset

const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt.config');
const app=require('../../server');
const { all } = require('../routes/assets.api.js');
const io=app.getSocketIo();
const clients = app.getAllclients
const turf = require('@turf/turf');
const mapboxToken = require('../../config/api.config').mapboxToken;
const axios = require('axios');

async function getDefaultRoute(src, dest) { 
    var locationString = src[0]+'%2C'+src[1]+'%3B'+dest[0]+'%2C'+dest[1];
    var url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + locationString + '.json';
    var queryParams = {
        geometries: 'geojson',
        steps: 'true',
        overview: 'full',
        language: 'en',
        access_token: mapboxToken
    };

    return axios.get(url, {params: queryParams})
    .then(res => {                
        return res.data.routes[0].geometry.coordinates; // return default route lineString coordinates only
    })
    .catch(err => {
        // console.log(err.message);
        return []; // return empty route if no default found
    });

}

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
                end: new Date(req.body.end),
                default: []
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

        if (user.type !== 'Admin') {
            console.log('here');
            throw 'Unauthorized access';
        }
    
        // saving a new asset to the database
        getDefaultRoute(asset.route.src, asset.route.dest)
        .then(route => {            
            asset.route.default = route; // setting the route            

            asset.save()
            .then(data => {                
                res.status(200).send({message: `Added new asset data ${data.id}`}); // sending back the new entry
            })
            .catch(err => {
                res.status(500).send({message: err.message || 'Some error in creating Asset data'}); // error handling
            });    
        })
        .catch(err => {
            // saving the default asset            
            asset.save()
            .then(data => {
                // io.sockets.emit('broadcast',{ description: 'New Asset has been added'});
                res.status(200).send({message: `Added new asset data ${data.id}`}); // sending back the new entry
            })
            .catch(err => {
                res.status(500).send({message: err.message || 'Some error in creating Asset data'}); // error handling
            });    
        });
        
    } catch (error) {        
        res.status(401).send({ message: 'Unauthorized access' });
    }    
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
        coordinates: getLatestLocation(asset),
        geofence:asset.geofence,
        defaultRoute:asset.route.default.map((eachLocation)=>{
            return {lat:eachLocation[1], long:eachLocation[0]}
        })
    };
}

// find all assets
exports.findAll = (req, res) => {
    console.log(req);
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
        res.status(401).send({ message: 'Unauthorized access' });
    }
 
};

// find a specific asset with id passed as parameter
exports.findOne = (req, res) => {       

    try {
        const user = jwt.verify(req.headers.token, jwtConfig.JWT_SECRET);
        Asset.findOne({id: req.query.id}) 
        .then(asset => {
            var now = new Date();            
            var yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));
            res.status(200).send(getCoordsInRange(asset, yesterday, now));
        })
        .catch(err => {
            res.status(201).send({message: err.message || 'Some error in retrieving Asset'}); // error handling
        });    
    } catch (error) {        
        res.status(401).send({ message: 'Unauthorized access' });
    }
};

exports.addGeoFence = (req,res)=>{
    try {
        const user = jwt.verify(req.headers.token, jwtConfig.JWT_SECRET);
        const response =   Asset.findOne({id:req.query.id}, (err,asset)=>{
        if(err){
            res.status(500).json({success:false, message:'Requested asset is not available'})
        } else{

            try {
                asset.geofence = req.body;
                asset.save();
                res.status(200).json({success:true})
            } catch (error) {
                res.status(500).json({success:false, message:'Internal server error, Unable to add geofence'})
            }
     
         
        }
       })
   
    } catch (error) {
        if(!user){
            res.status(401).json({success:false, message:'Unauthorized'})
        }
        res.status(400).json({success:false, message:'Bad request'})
    }
}


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
    try {
        const user = jwt.verify(req.headers.token, jwtConfig.JWT_SECRET);
        if (user.type !== 'Admin') throw 'Unauthorized access';
    
        const reqId = req.query.id; // required reqId

        Asset.deleteOne({id: reqId})
        .then(() => {
            res.status(200).send({message: 'Asset with id ' + reqId + ' was deleted successfully'}); // success message
        })
        .catch(err => {
            res.status(404).send({message: err.message || 'Some error in deleting Asset'}); // error handling
        });
    } catch (error) {        
        res.status(401).send({ message: 'Unauthorized access' });
    }
    
};



// this function is used to find the distance between two (latitude, longitude) pairs
function distance(point1, point2) {
    var lat1 = point1.lat, lat2 = point2.lat;
    var lon1 = point1.long, lon2 = point2.long;

	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		dist = dist * 1.609344;
		return dist;
	}
}

// find a specific asset and update it 
exports.updateOne = (req, res) => {
    const reqId = req.query.id; // required id
    // io.sockets.emit('broadcast',{ description: 'Sample message to all connected!'});


    /**
     * Commented tejeswar legacy changes
     */

    // Asset.updateOne({id: reqId}, {$push: {'location.coordinates': [
    //     {ts: new Date(req.body.ts), lat: +req.body.lat, long: +req.body.long}
    // ]}})
    // .then(transaction => {
    //     console.log(clients);
    //     Object.keys(clients).forEach((client)=>{
    //         console.log(reqId);
    //         if(clients[client].timelineView){
    //             console.log("came here")
    //             if(clients[client].assetID ===reqId){

    //                 Asset.find({id: reqId}) 
    //                 .then(asset => {
    //                     console.log("here");
    //                     io.to(client).emit('updated-location-details', {data:asset})
    //                 })
    //                 .catch(err => {
    //                    console.log(err);
    //                 });    
    

    //             }

    //         }
    //     })

    Asset.updateOne({id: reqId}, {$push: {'location.coordinates': [
        {ts: new Date(req.body.ts), lat: +req.body.lat, long: +req.body.long}
    ]}})
    .then(transaction => {

        Asset.findOne({ id: reqId }, (err, asset)=>{

            if(!err){                
                var now = new Date();              
                var yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));
                     
                    Object.keys(clients).forEach((client)=>{               
                        if(clients[client].timelineView){ 
                            console.log("came here")
                            if(clients[client].assetID ===reqId){
                                /**
                                 * Updated logic for geofence
                                 */
                                let latestLocation = getLatestLocation(asset.toObject());

                                var pt = turf.point([latestLocation.long,latestLocation.lat]);
                        
                                if(asset.geofence.lenght>0){
                                    var polygon = turf.polygon(asset.geofence.toObject());
                                    var isPointOnPolygon = turf.booleanPointInPolygon(pt, polygon);
                                    if (!isPointOnPolygon) {  // geofence check error
                                        io.to(client).emit('OUT OF GEOFENCE', {data:reqId}); 
                                            console.log("Data Asset")
                                                                   
                                    } 
    
                                }

                                var defaultRoute = turf.lineString(asset.route.default);
                                if (!turf.booleanPointOnLine(pt, defaultRoute)) {   // default route deviation check error
                                    io.to(client).emit('DEVIATING FROM ROUTE', {data: reqId}); 
                                }

                                io.to(client).emit('updated-location-details', {data:getCoordsInRange(asset, yesterday, now)});
                            }
                        }
                    });
    
            } else{
                res.status(500).json({message: 'Internal server error '+ reqId});
            }

        })

     
        res.status(200).send({message: 'Successfully updated Asset with id '+ reqId}); // update process info
    })
    .catch(err => {        
        res.status(404).send({message: err.message || 'Some error in updating Asset'}); // error handling
    });
};



