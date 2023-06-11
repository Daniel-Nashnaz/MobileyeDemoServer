const express = require("express");
const http = require("http");
const path = require("path");
const app = express();

const cors = require('cors')

const { routesInit } = require('./Routes/configurations');
//console.log(process.env.user);
//infromation in json
app.use(express.json());

const whitelist = ["http://localhost:3001"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))

//Go to file public and get data
app.use(express.static(path.join(__dirname, 'public')));

//Initializes existing ruoters
routesInit(app);

const server = http.createServer(app);

let port = process.env.PORT || 3500;

server.listen(port);