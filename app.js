const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const db = require('./db/index');
// const { create } = require("node:domain");
// const Review  = require("./models");
// const Book = require('./models/book')
//In app.js, update your require for Book to come from ./models (the index file) 
// const Book = require('./models').Book
// const Review = require('./models').Review
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

//Part 4: Create Reviews
//Add a new route to app.js:
app.post("/api/books/:bookId/reviews", async (request, response, next) => {
  try{
    const bookId = Number(request.params.bookId)
    const {reviewer, rating, comment} = request.body;
    const newReview = {
      reviewer, rating, comment, bookId
    }
    
    
    
    // await Review.create({reviewer, rating, comment})
    await Review.create(newReview)
    response.status(201).json(newReview);
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

app.use((error, request, response, next) => {
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
