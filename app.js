const express = require("express");
const morgan = require("morgan");
const cors = require("cors");



// TODO: Workshop Part 1: import your db connection from ./db once it's wired up.
// TODO: Workshop Part 2: import your Book model from ./models/Book once it's defined.

// For part 1, step 3, i have to import the database that i added in the 
// db folder which is index.file:
const db = require('./db/index')
// this also works, since the router will automatically looking for the index file.
// const db = require('./db') 
// end part 1 step 3.

//To test part 1: in app.js, temporarily add:
// db.authenticate().then(() => 
//   console.log("DB connected")).catch(console.error)
// end test.


// Part 3: Create the Table
//Import your Book model (this is what registers it with the connection).
const Book = require('./models/book')

const app = express();
const PORT = 8080;

// middleware ---------------------------------------
app.use(express.json()); // lets the server read JSON sent in a request body (req.body)
app.use(morgan("dev")); // logs method + url for every request
app.use(cors()); // allows a future frontend (different origin) to call this API

// in-memory data ------------------------------------
// let books = [
//   { id: 1, title: "The Pragmatic Programmer", author: "David Thomas", genre: "Tech", available: true },
//   { id: 2, title: "Educated", author: "Tara Westover", genre: "Memoir", available: true },
//   { id: 3, title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", available: false },
//   { id: 4, title: "Sapiens", author: "Yuval Noah Harari", genre: "History", available: true },
//   { id: 5, title: "The Alchemist", author: "Paulo Coelho", genre: "Fiction", available: true },
// ];

// let nextId = 6; // use this for any new book you create

// routes --------------------------------------------
// TODO: Workshop Part 4: one at a time, swap the array logic below for a real
// Book query. Keep the same path, same status codes, same 404 checks —
// only what's inside each try block changes.

// Part 2: smallest possible route, before touching book data
app.get("/", (request, response) => {
  response.send("Books API is running");
});

// Part 3: GET all books
// TODO: Workshop: swap `books` for the Book method that returns every row.
app.get("/api/books", async (request, response, next) => {
  try {
    const getALLRow = await Book.findAll() //modified: when i use corectly the modle's name it will automatically show me the keywords. (it is Book not books)
    response.json(getALLRow); // change to getAllRow
  } catch (error) {
    next(error);
  }
});

// Part 4: GET one book by id
// TODO: Workshop: swap `.find()` for the Book method that looks up by primary key.
// It returns null when nothing matches — your 404 check below still applies.
// app.get("/api/books/:id", (request, response, next) => {
//   try {
//     const id = Number(request.params.id); // request.params.id is always a string — Number() makes it comparable
//     const book = books.find((b) => b.id === id);

//     if (!book) {
//       return response.sendStatus(404);
//     }

//     response.json(book);
//   } catch (error) {
//     next(error);
//   }
// });

// Part 4: modified:
app.get("/api/books/:id", async (request, response, next) => {
  try {
    const id = Number(request.params.id); // request.params.id is always a string — Number() makes it comparable
    // const book = books.find((b) => b.id === id); // we will use database instead of using hardcode, so we need to change it.
    // const getOneBook = await Book.findOne({
    //   where : {}
    // }) // we don't need this line since we are searching by id, which is PK.
    const book = await Book.findByPk(id) // we need passing by the id.

    if (!book) {
      return response.sendStatus(404);
    }
    response.json(book);
  } catch (error) {
    next(error);
  }
});

// Part 5: POST a new book
// TODO: Workshop: swap the manual id/push for the Book method that creates a row
// directly from req.body. nextId goes away — the database assigns the id now.
app.post("/api/books", async (request, response, next) => {
  try {
    const { title, author, genre } = request.body;

    // const newBook = {
    //   // id: nextId,
    //   title,
    //   author,
    //   genre,
    //   available: true,
    // };
    // nextId++; 

    // books.push(newBook);
    const newBook = await Book.create({title, author, genre})
    // await Book.create(newBook) // this line already include pushing.
    
    response.status(201).json(newBook);
  } catch (error) {
    next(error);
  }
});

// Part 6: PATCH an existing book — only changes the fields that were sent
// TODO: Workshop: find the book the same Sequelize way as the GET-one route above,
// then call the instance method that updates it in place with req.body.
// app.patch("/api/books/:id", (request, response, next) => {
//   try {
//     const id = Number(request.params.id);
//     const book = books.find((b) => b.id === id);

//     if (!book) {
//       return response.sendStatus(404);
//     }

//     Object.assign(book, request.body);

//     response.status(200).json(book);
//   } catch (error) {
//     next(error);
//   }
// });

// modified:
app.patch("/api/books/:id", async(request, response, next) => {
  try {
    const id = Number(request.params.id);
    // const book = books.find((b) => b.id === id);
    const getALLRow = await Book.findByPk(id) // since we need to find the exact one, so we need to us findByPK(id)

    if (!getALLRow) {
      return response.sendStatus(404);
    }

    // Object.assign(book, request.body); // request.body is the user's input filed.
    getALLRow.update(request.body)
    await Book.Save()

    // response.status(200).json(book);
  } catch (error) {
    next(error);
  }
});

// Part 7: DELETE a book
// TODO: Workshop: find the book first, same as above, then call the instance
// method that removes itself — no more findIndex/splice.
app.delete("/api/books/:id", async (request, response, next) => {
  try {
    const id = Number(request.params.id);
    // const indexToDelete = books.findIndex((b) => b.id === id);
    const deleteOneBook = await Book.findByPk(id)

    if (!deleteOneBook) {
      return response.sendStatus(404);
    }

    // books.splice(deleteOneBook, 1);
    await deleteOneBook.destroy()

    response.sendStatus(204); // 204 No Content — no body on a successful delete
  } catch (error) {
    next(error);
  }
});

// TODO: Workshop cleanup: once all five routes above use Book instead of `books`,
// delete the `books` array and `nextId` variable up top — nothing should
// reference them anymore.

// error-handling middleware -------------------------
// 4 parameters (error first) is how Express recognizes this as an error handler.
app.use((error, request, response, next) => {
  console.error(error);
  response.sendStatus(500);
});

// app server ------------------------------------------
async function startApp() {
  // TODO: Workshop Part 3: this is where your table gets created from the Book
  // model. Call the sync method on your db connection and await it — the
  // table must exist before app.listen lets any request in.

  // This is need to in the startApp function
  // make sure the created the table first then started the server.

// first try:
//   try{
//     await db.async()
//     console.log("Database async!")
//   }.then app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// } catch(error){
//   console.log("Error!")

//   }
// end first try

// 3.1-Try to connect and create tables (db.sync).
// 3.2-Wait until the tables are ready, then log a success message.
// 3.3-Then open the gates for web traffic (app.listen).
// 3.4-If anything breaks, do not open the server; log a failure report instead.

// second try: 
  // try {
  //   //Sync our JavaScript models to the PostgreSQL database to create the table.
  //   // Do not move to the next line until this is completely finished.
  //   await db.sync()
  //   console.log("Database synced!")

  //   //Now that the database is completely ready, 
  //   //open up Express to start accepting incoming web requests from clients on port 8080
  //   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    
  //   ////If anything in the try block failed, intercept that error right here so we can look at it.
  //   } catch (error) {
  //     console.error("Failed synced Database.")
  //   }

// revised：
  try {
    await db.sync()
    console.log("Database synced!")

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    
    } catch (error) {
      console.error("Failed synced Database.")
    }
} 


// Then use this command to test out: psql -U postgres -d books_api -c "\dt"
// Part 3 end

async function startApp(){
await db.sync({

})

console.log('DB conneted ....')
app.listen(PORT, ()=> console.log('Server running on port ${PORT}'));

}

startApp();
