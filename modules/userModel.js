//const jwt = require("jsonwebtoken");
///const { config } = require("../config/secret")
const config = require("../config/dbconfig")
const sql = require('mssql');

async function getUserName(userId) {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('input_parameter', sql.Int, userId)
      .query('select UserName from Users where id = @input_parameter');
    return result.recordset[0].UserName;
  } catch (error) {
    console.log(error);
  }

}

async function getUser(userId, vehicleNumber) {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('input_parameter1', sql.Int, userId)
      .input('input_parameter2', sql.Int, vehicleNumber)
      .query("SELECT * from Vehicles where UserID = @input_parameter1 AND VehicleNumber=@input_parameter2");
    return result.recordset;

  }
  catch (error) {
    console.log(error);
  }finally{
    await sql.close();
  }
}

async function callSPOfStatistics(tripId) {
  try {
    let pool = await sql.connect(config);
    const result = await pool.request()
      .input('tripId', sql.Int, tripId)
      .execute(`GetAllStatisticsOfTravel`);
    return result.recordset;

  } catch (error) {
    console.log(error);
  }finally{
    await sql.close();
  }
}


async function callSPThatEndTravel(data) {
  try {
    let pool = await sql.connect(config);
    const result = await pool.request()
      .input('tripId',data.tripId)
      .output('statusReturn')
      .execute(`AddEndToTravel`);
      const status= {
        status:result.output.statusReturn
      };
      return status;
  } catch (error) {
    console.log(error);
  }finally{
    await sql.close();
  }
}


async function callSPTathAddTravel(details) {
  try {
    let pool = await sql.connect(config);
    const result = await pool.request()
      .input('userNameOrEmail', details.userNameOrEmail)
      .input('nuberOfVehicle', details.numVehicle)
      .output('statusReturn')
      .execute(`AddTravel`);
    const status = {
      tripID:+result.output.statusReturn
    };
    return status;
  } catch (error) {
    console.log(error);
  }finally{
    await sql.close();
  }
}

async function insertDataOfDrive(dataFromCar) {
  const data = dataFromCar;
  try {
    let pool = await sql.connect(config);
    const result = await pool.request()
      .input('tripID', data.About.TripID)//to do it you get json
      .input('timeFromBeginning', data.TimeFromBeginning)
      .input('lat', data.Latitude)
      .input('lon', data.Longitude)
      .input('forwardWarningDirection', data.ForwardWarning.Directions)
      .input('forwardWarningDistance', data.ForwardWarning.Distance)
      .input('laneDepartureWarning', data.LaneDepartureWarning)
      .input('pedestrianAndCyclistCollisionWarning', data.PedestrianAndCyclistCollisionWarning)
      .input('suddenBraking', data.SuddenBraking)
      .input('speedAllowed', data.Speed.SpeedAllowed)
      .input('currentSpeed', data.Speed.CurrentSpeed)
      .input('distanceTraveledMile', data.DistanceTraveledMile)
      .output('ret')
      .execute(`InsertInformationInRealTime`);
    return result;
  } catch (error) {
    console.log(error);
  }finally{
    await sql.close();
  }
}

async function callSPThatSetScore(data) {
  try {
    let pool = await sql.connect(config);
    const result = await pool.request()
      .input('tripId',data.tripId)
      .input('score',data.score)
      .output('statusReturn')
      .execute(`SetScore`);
      const status= {
        status:result.output.statusReturn
      };
      return status;
  } catch (error) {
    console.log(error);
  }finally{
    await sql.close();
  }
}

module.exports = {
  getUser: getUser,
  getUserName: getUserName,
  callSPOfStatistics: callSPOfStatistics,
  insertDataOfDrive:insertDataOfDrive,
  callSPTathAddTravel:callSPTathAddTravel,
  callSPThatEndTravel:callSPThatEndTravel,
  callSPThatSetScore,callSPThatSetScore
}
