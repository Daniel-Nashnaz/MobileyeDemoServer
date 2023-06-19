//const jwt = require("jsonwebtoken");
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
    // Create a connection pool
    await sql.connect(config);

    // Create a new request object
    const request = new sql.Request();

    // Set the input parameters
    request.input('tripID', sql.Int, data.About.TripID);
    request.input('timeFromBeginning', sql.NVarChar(20), data.TimeFromBeginning);
    request.input('lat', sql.Float, data.Latitude);
    request.input('lon', sql.Float, data.Longitude);
    request.input('forwardWarningDirection', sql.NVarChar(20),data.ForwardWarning.Directions.toString());
    request.input('forwardWarningDistance', sql.NVarChar(10), data.ForwardWarning.Distance.toString());
    request.input('laneDepartureWarning', sql.NVarChar(20), data.LaneDepartureWarning.toString());
    request.input('pedestrianAndCyclistCollisionWarning', sql.NVarChar(10), data.PedestrianAndCyclistCollisionWarning.toString());
    request.input('suddenBraking', sql.Bit, data.SuddenBraking);
    request.input('speedAllowed', sql.Int, data.Speed.SpeedAllowed);
    request.input('currentSpeed', sql.Int, data.Speed.CurrentSpeed);
    request.input('distanceTraveledMile', sql.Float, data.DistanceTraveledMile);
    request.output('ret', sql.Int);

    // Execute the stored procedure
    const result = await request.execute('InsertInformationInRealTime');

    // Get the output parameter value
    const retValue = result.output.ret;
    console.log('Return value:', retValue);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    // Close the connection pool
    await sql.close();
  }
  /*try {
    console.log("start");
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
      console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }finally{
    await sql.close();
  }*/

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
  }
}


async function callSPOfRealTimeInfoByTripId(tripId) {
  try {
    let pool = await sql.connect(config);
    const result = await pool.request()
      .input('tripId', sql.Int, tripId)
      .query`SELECT * FROM dbo.GetAllRealTimeInfoByTripId(@tripId)`;
    return result.recordset;

  } catch (error) {
    console.log(error);
  }  finally {
    // Close the connection pool
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
  callSPThatSetScore:callSPThatSetScore,
  callSPOfRealTimeInfoByTripId,callSPOfRealTimeInfoByTripId,

}
