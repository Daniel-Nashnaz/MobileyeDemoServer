/*
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
*/
// This variable stores the initial score value
let score = 100;

 //* This function generates a score based on the trip data passed as parameter.
 //* @param {object} tripData - An object containing trip data such as lane departure warnings, forward warning directions, sudden braking count, etc.
 //* @returns {object} - An object containing the generated score and the trip ID.

function generateScore(tripData) {
    // This variable stores the temporary score value
    let tempScore = 0;
  
    // If there were no lane departure warnings, add 10 points to the temporary score
    if (tripData.LaneDepartureWarningCount === 0) {
      tempScore += 10;
    }
  
    // If there were no forward warning directions, add 10 points to the temporary score
    if (tripData.ForwardWarningDirectionsCount === 0) {
      tempScore += 10;
    }
  
    // Deduct points based on the number of forward warning directions and lane departures
    score -= (tripData.NumForwardWarningDirectionsRight +
              tripData.NumForwardWarningDirectionsUp +
              tripData.NumForwardWarningDirectionsLeft) * 3;
    score -= (tripData.NumRightLaneDeparture +
              tripData.NumLeftLaneDeparture) * 3;
  
    // Deduct points based on the sudden braking count and the number of times the speed limit was exceeded
    score -= tripData.SuddenBrakingCount * 4.5;
    score -= tripData.NumTimesExceededSpeedLimit * 1.5;
  
    // Deduct points based on the pedestrian and cyclist collision warning count
    score -= tripData.PedestrianAndCyclistCollisionWarningCount * 2.5;
  
    // If the average speed is less than 100 and the score is between 75 and 85, add 10 points to the score
    if (tripData.AverageSpeed < 100 && (score >= 75 && score <= 85)) {
      score += 10;
    }
    // If the average speed is greater than 130 or the max speed is greater than 140, deduct 15 points from the score
    else if (tripData.AverageSpeed > 130 || tripData.MaxSpeed > 140) {
      score -= 15;
    }
  
    // If the score is less than 75, add the temporary score to the score
    if (score < 75) {
      score += tempScore;
    }
  
    // If the traveled mile is greater than 50 and the score is between 80 and 90, add 10 points to the score
    if (tripData.TraveledMile > 50 && (score >= 80 && score <= 90)) {
      score += 10;
    }
  
    // Ensure the score is within the range of 0 to 100
    if (score < 0) {
      score = 0;
    } else if (score > 100) {
      score = 100;
    }
  
    // Return an object containing the generated score and the trip ID
    return { score: score, tripId: tripData.TripID };
  }
  
  // Export the generateScore function
  module.exports = {
    generateScore,
    generateScore
  } 