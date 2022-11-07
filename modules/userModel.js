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

module.exports = {
  getUser: getUser,
  getUserName: getUserName,
}
