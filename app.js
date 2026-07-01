const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const db = require('./db/index'); // we don't need index, it will look like this: const db = require('./db'); 
// const { create } = require("node:domain");
// const Review  = require("./models");
// const Book = require('./models/book')
//In app.js, update your require for Book to come from ./models (the index file) 

// first way :this thses also works.
// const Book = require('./models').Book
// const Review = require('./models').Review

// seconde way:
// since in models/index.js , this is a line :module.exports = {Review, Book},
// this is an object so we use .Book and .Review
const {Review, Book} = require('./models')


const app = express();
const PORT = 8080;

// middleware ---------------------------------------
app.use(express.json()); // lets the server read JSON sent in a request body (req.body)
app.use(morgan("dev")); // logs method + url for every request
app.use(cors()); // allows a future frontend (different origin) to call this API


// routes --------------------------------------------


app.get("/", (request, response) => {
  response.send("Books API is running");
});

//GET all books
app.get("/api/books", async (request, response, next) => {
  try {
    const getALLRow = await Book.findAll() //modified: when i use corectly the modle's name it will automatically show me the keywords. (it is Book not books)
    response.json(getALLRow); // change to getAllRow
  } catch (error) {
    next(error);
  }
});

//GET one book by id
app.get("/api/books/:id", async (request, response, next) => {
  try {
    const id = Number(request.params.id); 
    // const book = await Book.findByPk(id)

    //Part3: update GET /api/books/:id:
    //Pass an extra option to your find-by-pk call that tells it to also load the book's associated reviews.
    const book = await Book.findByPk(id, {
      include: Review
    })
    //end

    if (!book) {
      return response.sendStatus(404);
    }
    response.json(book);
  } catch (error) {
    next(error);
  }
});

//POST a new book
app.post("/api/books", async (request, response, next) => {
  try {
    const { title, author, genre } = request.body;
    const newBook = await Book.create({title, author, genre})
    response.status(201).json(newBook);
  } catch (error) {
    next(error);
  }
});


// class note:
// Part 4
// app.post("/api/books/:bookId/reviews", async (request, response, next) => {
//   try{
//     const id = Number(request.params.bookId)
//     const book = await Book.findByPk(id)
//     if(!book) {
//       return response.statuscode(404)
//     }
//     // this line just for the demo
//     // const {reviewer, comment,, rating} = request.body
//     // end

//     await Review.create({
//       ...request.body, // we need to type the specific 
//       bookId:id
//     })
//     response.sendStatus(201)
//   }catch(error){
//     next(error);// error middleware
//   }
// })
// //end 

//Stretch Challenges + part 4
//Add a check: if rating is missing or isn't a number between 1 and 5, 
// respond with 400 before creating the review.
app.post("/api/books/:bookId/reviews", async (request, response, next) => {
  try{
    const id = Number(request.params.bookId)
    // const book = await Book.findByPk(id)
    // if(!book) {
    //   return response.statuscode(404)
    // }
    // added for the Stretch Challenges
        // if we have mutiples fields, then use this way to code.
    const {rating} = request.body //=> the other way to code : const rating = request.body.rating
    if(!rating || (1 > rating || rating > 5)){ //0<rating && rating<6
      return response.sendStatus(400)
    }
    // end
            // note : This is how understanding, next block//  await Review.create
            //        {        
                    //   "reviewer":"FV",
                    //   "rating": 60,
                    //   bookId: id
                    // }
    await Review.create({            
      ...request.body, 
      bookId:id
    })
    response.sendStatus(201) // sendStatus will stop right away.
  }catch(error){
    next(error);
  }
})

// end

//Part 4: mine version : Create Reviews
//Add a new route to app.js:
// app.post("/api/books/:bookId/reviews", async (request, response, next) => {
//   try{
//     const bookId = Number(request.params.bookId)
//     const {reviewer, rating, comment} = request.body;
//     const newReview = {
//       reviewer, rating, comment, bookId // we need to conneted bookId with newReview, so pass the bookId,
//       //  and it is the foreigner key in Review and the primary key in Book.
//     }
//     // await Review.create({reviewer, rating, comment})
//     await Review.create(newReview)
//     response.status(201).json(newReview);
//   }catch(error){
//     next(error);// error middleware
//   }
// })
// end

//Stretch Challeges:
//Add GET /api/books/:bookId/reviews — 
//return all reviews for one book without loading the whole book object.
app.get('/api/books/:bookId/reviews', async(request, response, next) => {
  try{                
      const bookId = Number(request.params.bookId)
      const allReviews = await Review.findAll({ // we need find from the Review table, so we need use Review.findAll
        where: {bookId : bookId}
      })
      response.json(allReviews)

  }catch(error){
    next(error);
  }
})
// end


// PATCH an existing book — only changes the fields that were sent
app.patch("/api/books/:id", async(request, response, next) => {
  try {
    const id = Number(request.params.id);
    const getALLRow = await Book.findByPk(id) 
    if (!getALLRow) {
      return response.sendStatus(404);
    }

    getALLRow.update(request.body)
    await Book.Save()
  } catch (error) {
    next(error);
  }
});

// DELETE a book
app.delete("/api/books/:id", async (request, response, next) => {
  try {
    const id = Number(request.params.id);
    const deleteOneBook = await Book.findByPk(id)

    if (!deleteOneBook) {
      return response.sendStatus(404);
    }

    await deleteOneBook.destroy()

    response.sendStatus(204); 
  } catch (error) {
    next(error);
  }
});

//Stretch Challeges:
//Add DELETE /api/reviews/:id
// delete a single review by its own id. Notice this route starts with /reviews, not /books.
app.delete('/api/review/:id',async (request, response, next) => {
  try {
    const id = Number(request.params.id);
    const deleteOneReview = await Review.findByPk(id)

    console.log("here",deleteOneReview)

    if(!deleteOneReview){
      return response.sendStatus(404)
    }
      await deleteOneReview.destroy()

    response.sendStatus(204);
  } catch (error) {
    next(error)
  }
})

app.use((error, request, response, next) => { // error middleware
  console.error(error);
  response.sendStatus(500);
});

// app server ------------------------------------------
async function startApp() {
  try {
    await db.sync()
    console.log("Database synced!")

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    
    } catch (error) {
      console.error("Failed synced Database.")
    }
} 

startApp();
