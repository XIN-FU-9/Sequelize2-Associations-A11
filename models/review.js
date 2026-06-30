//Part 1: Add the Review Model
const { DataTypes} = require('sequelize');
const dbConnection = require('../db') 

// Import DataTypes and your db connection.
// Define a Review model with these fields:
const Review = dbConnection.define('review', {
    reviewer:{
        type: DataTypes.STRING,
        allowNull : false
    },
    
    rating:{
        type: DataTypes.INTEGER,
        allowNull: false
    },

    comment:{
        type: DataTypes.TEXT,
    }

})


// Export the model.
module.exports = Review

//Explain: you didn't add bookId to the field list above. 
// Where will that column come from, and when will it actually appear in the database?
// answer:
            
