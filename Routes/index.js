const express = require("express");
const dateAndTime = require('date-and-time');
const RandomInformation = require('../modules/DataToSend');
const jwt = require("jsonwebtoken");
const dboperations = require('../modules/userModel');
const func = require('../modules/analysis');
require('dotenv').config();
const router = express.Router();
const random = new RandomInformation.RandomData();
const now = new Date();
const { auth } = require("../middlewares/auth");



router.get('/', auth, (request, response) => {
    request.tokenData
    //console.log(random.timeFormBeginning);
    const directions = random.getDirectionsWarning();
    const allowed = random.getRandomSpeedAllowed();
    const current = random.getRandomCurrentSpeed(allowed);
    response.json({
        "Latitude": random.getLatitude(),
        "Longitude": random.getLongitude(),
        "ForwardWarning": {
            "Directions": directions,
            //in meters
            "Distance": random.getDistanceWarning(directions)
        },
        "LaneDepartureWarning": random.getLaneDepartureWarning(),
        //in meters
        "PedestrianAndCyclistCollisionWarning": random.getCollisionWarning(directions),
        "Speed": {
            "SpeedAllowed": allowed,
            "CurrentSpeed": current,
            "SpeedAboveLimit": random.isSpeedAboveLimit(allowed, current)
        },
        "SuddenBraking": random.isSuddenBraking(),
        //in km
        "DistanceTraveledMile": random.getRandomTraveledMile(),
        "TimeFromBeginning": random.timeFormBeginning,
        "About": {
            "UserName": request.tokenData.userName,
            "VehicleID": request.tokenData.vehicleNumber,
            "TimeStart": dateAndTime.format(now, 'HH:mm:ss YYYY/MM/DD')
        }
    }).status(200);
    response.end();
});


router.post('/', (request, response) => {
    const users = {
        userId: request.body.userId,
        vehicleNumber: request.body.vehicleNumber,
    }
    dboperations.getUser(users.userId, users.vehicleNumber).then(result => {
        if (result.length > 0) {
            dboperations.getUserName(users.userId).then(result => {
                try {
                    users.userName = result;
                    const token = jwt.sign(users, process.env.tokenSecret, { expiresIn: "20d" });
                    return response.status(200).json({ token });
                } catch (err) {
                    return response.status(500).json({ message: "Token not created!" });
                }
            }).catch(err => {
                return response.status(404).json(err)
            });
        } else {
            return response.status(404).json({ message: "User Or vehicle Not found!" });
        }
    }).catch(err => { console.log(err) });

});

router.post('/dataFromSensor', (request, response) => {
    dboperations.insertDataOfDrive(request.body).then(res => {
        console.log(request.body)
    });
    response.sendStatus(200);
});

router.get('/getAllStatistics', (request, response) => {
   /* dboperations.callSPOfStatistics().then(result => {
        const data = result[0];
        dboperations.callSPThatSetScore(func.generateScore(data)).then(x => {
            console.log(x);
        });
        response.json(data).status(200);
    });*/
});

router.get('/testOutput', (request, response) => {
    dboperations.callSPOut().then(result => {
        console.log(result);
    });
    response.sendStatus(200);

});

//get in body tridId
router.post('/endTravel', (request, response) => {
    const data = request.body;
    if (data.tripId == null || data == null) {
        return response.status(406).json({ "error": "must send trip ID" });
    }

    dboperations.callSPThatEndTravel(data).then(result => {
        dboperations.callSPOfStatistics(data.tripId).then(result => {
            const data = result[0];
            dboperations.callSPThatSetScore(func.generateScore(data)).then(result => {
               // console.log(result);
                //console.log(data);

                //response.json(data).status(200);
            });
        });        
        return response.status(200).json(result);
    });

});

//get from body  username and number vehicle and save in table Travel.
router.post('/addTravel', (request, response) => {
    const data = request.body;
    if (data.userNameOrEmail == null || data.numVehicle == null || data == null) {

        return response.status(406).json({ "error": "must send userName Or Email and number Vehicle" });
    }
    dboperations.callSPTathAddTravel(data).then(result => {
        return response.status(200).json(result);
    });

});

module.exports = router;