const express = require('express'); // for server
const bodyParser = require('body-parser'); // for parsing requests sent to and from client and db
// swagger documentation
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./flarrowverse-JumboGPS-T12-1.0.0.json');

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
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    () => console.log('Connected to local database Assets')
);  

const clients = {}
/**
 * @description Connection to socket.io
 */
 var http = require('http').createServer(app);
 var io = require('socket.io')(http,{
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"]
  }
 });
 io.on('connection', (socket)=>{
  console.log('a user connected');

  if(!clients[socket.id]){
    clients[socket.id] = {
      timelineView:false
    }
  }




socket.on('disconnect', ()=>{
    delete clients[socket.id];
    console.log(clients)
  })

  socket.on('timeline-view', (data)=>{

    data = JSON.parse(data);
    clients[data.socketID].timelineView = true
    clients[data.socketID].assetID = data.assetID


   })
 })

 function getSocketIo(){
  return io;
}

module.exports.getAllclients = clients;
module.exports.getSocketIo=getSocketIo


// base url get request
const assetApiRoutes = require('./app/routes/assets.api');
app.use('/api/assets', assetApiRoutes);

const userApiRoutes = require('./app/routes/users.api');
app.use('/api/users', userApiRoutes);

// serving swagger docs
app.use("/api/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

// starting server on port 8081
const server = http.listen(3030, () => {
    var hostIP = server.address().address;
    var hostPort = server.address().port;

    console.log('Server started at http://'+hostIP+':'+hostPort);
});

module.exports = app;