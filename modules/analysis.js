let score = 100;

function generateScore(tripData) {

    let tempScore = 0;

    if (tripData.LaneDepartureWarningCount === 0) {
        tempScore += 10
    }

    if (tripData.ForwardWarningDirectionsCount === 0) {
        tempScore += 10
    }

    score -= (tripData.NumForwardWarningDirectionsRight +
        tripData.NumForwardWarningDirectionsUp +
        tripData.NumForwardWarningDirectionsLeft) * 3;

    score -= (tripData.NumRightLaneDeparture +
        tripData.NumLeftLaneDeparture) * 3;

    score -= tripData.SuddenBrakingCount * 4.5;

    score -= tripData.NumTimesExceededSpeedLimit * 1.5;

    score -= tripData.PedestrianAndCyclistCollisionWarningCount * 2.5;

    if (tripData.AverageSpeed < 100 && (score >= 75 && score <= 85)) {
        score += 10;
    }
    else if (tripData.AverageSpeed > 130 || tripData.MaxSpeed > 140) {
        score -= 15;
    }
    if (score < 75) {
        score += tempScore;
    }

    if (tripData.TraveledMile > 50 && (score >= 80 && score <= 90)) {
        score += 10;
    }
    if (score < 0) {
        score = 0;
    } else if (score > 100) {
        score = 100
    }

    return { score: score, tripId: tripData.TripID };

}


module.exports = {
    generateScore, generateScore

}
