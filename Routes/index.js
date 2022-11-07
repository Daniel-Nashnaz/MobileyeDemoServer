const express = require("express");
const dateAndTime = require('date-and-time');
const RandomInformation = require('../modules/DataToSend');
const jwt = require("jsonwebtoken");
const dboperations = require('../modules/userModel');
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
        "Pedestrian&CyclistCollisionWarning": random.getCollisionWarning(directions),
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

module.exports = router;