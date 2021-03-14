const mongoose = require('mongoose'); // mongoose

/*
Asset: {
    id: a unique id,
    name: Asset name,
    type: asset type,
    route: {
        src: Source address,
        dest: Destination address,
        start: Time of departure from src
        end: Estimated time of arrival(can change)
    },
    location: {
        type: 'Feature'
        geometery: {
            type: 'Point',
            coordinates: [[long, lat]]
        },
        properties: {
            id,
            name,
            description
        }
    }
}
*/

const AssetSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    route: {
        src: {
            type: String,
            required: true
        },
        dest: {
            type: String,
            required: true
        },
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        }
    },
    location: {
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [{ts: Date, lat: Number, long: Number}],
          required: true
        }
    }
}, { collection: 'assets' });

module.exports = mongoose.model('Asset', AssetSchema);