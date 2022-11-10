const random = require("random");
const lodash = require('lodash');
const XLSX = require('xlsx');
const data = XLSX.readFile('D:\\Users\\Daniel\\Documents\\MobileyeDemoServer\\config\\LocationsList.csv');
let indexOfLocation = 1;
let timeDisplay = 0;
const locations = data.Sheets[data.SheetNames[0]];
exports.RandomData = class {
    #distance = 0;
    #arr = [
        "Good",
        "Right",
        "Left",
        "Up"
    ];

    constructor() {
        this.stopwatch();
        setInterval(() => { indexOfLocation++; }, 5000);
    }

    get timeFormBeginning() {
        return timeDisplay;
    }

    stopwatch() {
        let startTime = 0;
        let elapsedTime = 0;
        let hrs = 0;
        let mins = 0;
        let secs = 0;


        startTime = Date.now() - elapsedTime;
        setInterval(updateTime, 1000);

        function updateTime() {
            elapsedTime = Date.now() - startTime;
            secs = Math.floor((elapsedTime / 1000) % 60);
            mins = Math.floor((elapsedTime / (1000 * 60)) % 60);
            hrs = Math.floor((elapsedTime / (1000 * 60 * 60)) % 60);
            secs = pad(secs);
            mins = pad(mins);
            hrs = pad(hrs);
            timeDisplay = `${hrs}h:${mins}m:${secs}s`;
            function pad(unit) {
                return (("0") + unit).length > 2 ? unit : "0" + unit;
            }
        }
    }

    getLatitude() {
        return locations[`A${indexOfLocation}`]["w"];
    }
    getLongitude() {
        return locations[`B${indexOfLocation}`].w;
    }

    getDirectionsWarning() {
        if (random.float() > 0.60) {
            return lodash.sample(this.#arr);
        }
        return this.#arr[0];
    }

    getDistanceWarning(directions) {
        if (directions === this.#arr[0]) {
            return "Ok";
        }
        else {
            return Number(random.float(0, 2.5).toFixed(2));
        }
    }

    getLaneDepartureWarning() {
        //return all element without Up
        return this.#arr[random.int(0, (this.#arr.length - 2))];
    }


    getCollisionWarning(directions) {
        //if the direction is not 'Good'
        if (directions !== this.#arr[0]) {
            if (random.float() > 0.65) {
                return Number(random.float(0, 3).toFixed(3));
            }
        }
        return "Ok";
    }

    getRandomSpeedAllowed() {
        if (random.float() > 0.80 || indexOfLocation > 500) {
            return random.int(7, 12) * 10;
        }
        else {
            return random.int(2, 7) * 10;
        }
    }

    getRandomCurrentSpeed(allowed) {
        if (allowed >= 80) {
            return random.int(70, 120);
        }
        else {
            return random.int(10, 70);
        }
    }

    isSpeedAboveLimit(allowed, current) {
        if (current > allowed + 10) {
            return true;
        }
        return false;
    }

    isSuddenBraking() {
        if (random.float() > 0.75) {
            return random.boolean();
        }
        return false;
    }

    getRandomTraveledMile() {
        return this.#distance = Number((this.#distance + random.float(0, 0.5)).toFixed(2));
    }
}