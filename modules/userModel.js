const jwt = require("jsonwebtoken");
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
  }
}
async function callSPInput(name) {
  try {
    let pool = await sql.connect(config);
    const result = await pool.request()
      .input('Name', name)
      .execute(`SearchEmployee`);
    return result.recordset;

  } catch (error) {
    console.log(error);
  }
}




async function callSPOut() {
  try {
    let pool = await sql.connect(config);
    const result = await pool.request()
      .output('Count', 0)
      .output('Max', 0)
      .output('Min', 0)
      .output('Average', 0)
      //or
      .output('Sum')
      .execute(`GetEmployeesStatus`);
    const status = {
      Count: +result.output.Count,
      Max: +result.output.Max,
      Min: +result.output.Min,
      Average: +result.output.Average,
      Sum: +result.output.Sum
    };
    return status;
  } catch (error) {
    console.log(error);
  }
}



async function callSPthatEndTravel(data) {
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
  }
}

async function insertDataOfDrive(dataFromCar) {
  const data = dataFromCar;
  try {
    let pool = await sql.connect(config);
    const result = await pool.request()
      .input('tripID', 1)//to do it you get json
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
    return result.recordset;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getUser: getUser,
  getUserName: getUserName,
  callSPInput: callSPInput,
  callSPOut: callSPOut,
  insertDataOfDrive:insertDataOfDrive,
  callSPTathAddTravel:callSPTathAddTravel,
  callSPthatEndTravel:callSPthatEndTravel
}
