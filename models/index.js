//part2
const dbConnection = require('../db')
//  Require both Book and Review at the top.
const Review = require('./review')
const Book = require('./book') 
// because we in the models folder, so we don't write this way:
// const Book = require('./models.book') 
//end 


//part 2 association:Write the line that says one book can have many reviews.
Book.hasMany(Review)
//Write the line that says each review belongs to exactly one book.
Review.belongsTo(Book, {
  foreignKey:"bookId"
})
//end

//Export both models from this file.
module.exports = {Review, Book}
// we can't have two exports 
// such as :
//          module.exports = Review
//          module.exports = Book
//end