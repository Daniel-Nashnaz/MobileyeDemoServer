const { ECOLOG_GREEN_LEVEL, ECOLOG_RED_LEVEL } = require("../constants/definitions");
const config = require("../config/dbconfig")
const sql = require('mssql');
async function tripEcological(data) {
    let lastSpeed = 0;
    try {
        // Create a connection pool
        const pool = await sql.connect(config);
      
        // Begin a transaction
        const transaction = new sql.Transaction(pool);
        await transaction.begin();
      
        // Loop through the data and insert it into the database
        for (const item of data) {
          // Create a new request object
          const request = new sql.Request(transaction);
      
          // Set the input parameters for the stored procedure
          const speedDifference = getAbsoluteValue(lastSpeed, item.CurrentSpeed);
          const levelPollution = getLevelOfPollution(speedDifference);
          request.input('rtdiId', sql.Int, item.ID);
          request.input('level', sql.NVarChar(10), levelPollution);
      
          // Execute the stored procedure
          await request.execute('InsertTripEcological');
      
          // Update the last speed value
          lastSpeed = item.CurrentSpeed;
        }
      
        // Commit the transaction
        await transaction.commit();
      
        // Close the connection pool
        await pool.close();
      } catch (err) {
        console.error('Error:', err.message);
      }

}

const getAbsoluteValue = (speedBefore, speedAfter) => {
    return Math.abs(speedAfter - speedBefore);
}

const getLevelOfPollution = (seepd) => {
    if (seepd <= ECOLOG_GREEN_LEVEL) {
        return "Green";
    }
    else if (seepd >= ECOLOG_RED_LEVEL) {
        return "Red";
    }
    return "Orange";
}


module.exports = {
    tripEcological,
    tripEcological
} 