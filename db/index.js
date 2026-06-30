const { Sequelize } = require('sequelize')

// TODO: Workshop Part 1: create a new Sequelize instance pointed at your
// books_api database, then export it. Same postgres:// connection string



//step 1: create a new Sequelize
const db = new Sequelize('postgres://localhost:5432/books_api')
//step 1 end

const dbConnection = null

module.exports = dbConnection

//step 2: exports this to let other files to use it.
module.exports = db
//step 2 end

//step 3: need to import this in the file app.js.

// then ://To check part 1: in app.js, temporarily add:
// db.authenticate().then(() => 
//   console.log("DB connected")).catch(console.error)