const express = require('express'); // for server
const bodyParser = require('body-parser'); // for parsing requests sent to and from client and db
// swagger documentation
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./meme-stream-api-2.0.0.json');

const app = express(); // express app creation

app.use(bodyParser.json()); // for parsing application/json format data
app.use(bodyParser.urlencoded({ extended: true })) // for parsing requests of content-type application/x-www-form-urlencoded

// Cross-Origin-Resource Sharing
const cors = require('cors');
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// connect to DB
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
mongoose.connect(
    dbConfig.url,
    { useNewUrlParser: true },
    () => console.log('Connected to local database assets')
);  

// base url get request
const apiRoutes = require('./app/routes/assets.api');
app.use('/assets', apiRoutes);

// serving swagger docs
app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

// starting server on port 8081
const server = app.listen(8081, () => {
    var hostIP = server.address().address;
    var hostPort = server.address().port;

    console.log('Server started at http://'+hostIP+':'+hostPort);
});