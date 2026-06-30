// part 2_step 1:(provided from instructions)Import DataTypes from sequelize, and import your db connection.
const { DataTypes, STRING, INTEGER, BOOLEAN } = require('sequelize');
const dbConnection = require('../db') // this is the defalut to find the index


// TODO: Workshop Part 2: add one key per field below, each set to a DataTypes type
// (and allowNull/defaultValue where noted). id is created automatically.
//   title          STRING   required
//   author         STRING   required
//   genre          STRING
//   publishedYear  INTEGER
//   available      BOOLEAN  defaults to true

// step 2: Define a Book model with these fields: 
const Book = dbConnection.define('book', {
    // Use object format to define the fields:
    title:{
        type: DataTypes.STRING, // use a "," after, not a ';'
        allowNull : false
    }, // use a "," after, not a ';'
    
    author:{
        type: DataTypes.STRING,
        allowNull: false
    },

    genre:{
        type: DataTypes.STRING,
    },
    
    publishedYear:{
        type: DataTypes.INTEGER
    },

    available:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }

})

// Explain: you didn't define an id field anywhere in the table above. 
// Where does it come from, and what does it default to?
// answer: Sequelize will help me automatically to add it.
//         and sequelize will take the integer as primary key.


// step 3: Export the model. (provided from instructions
module.exports = Book

