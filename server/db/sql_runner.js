// Get a Pool instance from the pg package.
const { Pool } = require("pg");
// Configure the Pool object to connect to our local database
const pool = new Pool({
  host: "localhost",
  database: "projectPokemon"
});

// Declare a class called SqlRunner with a static **run** method
class SqlRunner {
  // **run** will take 2 arguments. An SQL string, array of values
  static run(sqlQuery, values = []) {
    // Use the Pool object to run the SQL query
    // .then takes a callback that will be passed the results of the SQL query
    return pool.query(sqlQuery, values).then(results => {
      return results;
    });
  }
}

module.exports = SqlRunner;
