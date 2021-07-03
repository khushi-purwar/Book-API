const express = require('express');
const routes = express.Router();

// database 
// const db = require('../database/index')

// Models
const BookModel = require('../../database/book');
const AuthorModel = require('../../database/author')

//  get routes-----------------------------------------------------

/*
Route =>             /books
Description =>  to get all books
Access => public
Parameters => none
Method => get
 */
routes.get('', async (req, res) => {    // using the prefix

  // using array
  // return res.json({books: db.books});

  // using mongodb
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
})


/*
Route =>             /book
Description =>  to get a specific book
Access => public
Parameters => isbn
Method => get
 */

routes.get('/:isbn', async (req, res) => {

  // using array
  //   const getBook = db.books.filter(
  //     (book)=> book.ISBN === req.params.isbn
  // );
  // if(getBook.length === 0){
  //   return  res.json({error: `No book found for the ISBN of ${req.params.isbn}`})
  // }
  // return res.json({book : getBook});

  //  using mongoDB
  const getBook = await BookModel.findOne({ ISBN: req.params.isbn })
  //  BOON KOT FOUND -> RETURN NULL -> BOOLEAN VALUE OF NULL IS FALSE

  if (!getBook) {
    return res.json({ error: `No book found for the ISBN of ${req.params.isbn}` })
  }
  return res.json({ book: getBook });
})

/*
Route =>             /c
Description =>  to get a specific book based on category
Access => public
Parameters => category
Method => get
 */

routes.get('/c/:category', async (req, res) => {

  // using array
  //   const getBooks = db.books.filter(
  //     (book)=> book.category.includes(req.params.category)
  // );
  // if(getBooks.length === 0){
  //   return  res.json({error: `No book found for the category of ${req.params.category}`})
  // }

  // return res.json({book : getBooks});

  //  using mongodb
  const getBooks = await BookModel.find({ category: req.params.category })

  if (!getBooks) {
    return res.json({ error: `No book found for the category of ${req.params.category}` })
  }
   
  return res.json({ book: getBooks });
  
})

/*
Route =>             /a
Description =>  to get a specific book based on authors
Access => public
Parameters => author
Method => get
 */

routes.get('/a/:author', async(req, res) => {

  //  using array
  // const getBooks = db.books.filter(
  //   (book) => book.authors.includes(parseInt(req.params.author))
  // );
  // if (getBooks.length === 0) {
  //   return res.json({ error: `No book found for the author ${req.params.author}` })
  // }
  // return res.json({ book: getBooks });

  // using mongoDB
  const getBooks = await BookModel.find({ authors: req.params.author })
  
  if (!getBooks) {
    return res.json({ error: `No book found for the author ${req.params.category}` })
  }
   
  return res.json({ book: getBooks });
})

//  --------------------------post requests-----------------------


/*
Route =>             /book/new
Description =>  to add a new book
Access => public
Parameters => none
Method => post
 */

routes.post('/new', async(req, res) => {

  // using array
  // const {newBook} = req.body;
  //   console.log(req.body);
  //   db.books.push(newBook);
  //   return res.json({books: db.books , message:"Book was added"})

  // using mongoDB

  try{
    const { newBook } = req.body;
    await BookModel.create(newBook);
    return res.json({ message: "Book was added" })
  }
  catch(error){
    return res.json({
      error : error.message
    })
  }
 
})

//  --------------------------put requests-----------------------


/*
Route =>             /book/update/
Description =>  to update book details (title)
Access => public
Parameters => isbn
Method => put
 */

routes.put('/update/:isbn', async(req, res) => {
  //  using array
  /*db.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.title = req.body.bookTitle;
      return;
    }
  });
  return res.json({ book: db.books })
  */

  // using mongoDB
   const updatedBook = await BookModel.findOneAndUpdate(
     {
       ISBN : req.params.isbn
      },
      {
       title : req.body.bookTitle
      },
      {
        new: true,   // if false, return the previous data, not the new one, but it is updated in db
      }
      );
      return res.json({ book: updatedBook })

})


/*
Route =>             /book/author/update/:isbn
Description =>  to update or add new author
Access => public
Parameters => isbn
Method => put
*/
routes.put('/author/update/:isbn', async(req, res) => {
  // using array
  /*
  // update book database -> book should be created before
  db.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      return book.authors.push(req.body.newAuthor);
    }
  })
  // update author database -> author should be created before
  db.authors.forEach((author) => {
    if (author.id === req.body.newAuthor) {
      return author.books.push(req.params.isbn);
    }
  })

  return res.json(
    { 
      books: db.books, 
      author: db.authors, 
      message: "New Author was added"
    })
  */

  // using mongoDB
   // updated book database
  const  updatedBook = await BookModel.findOneAndUpdate ( 
    {
     ISBN : req.params.isbn
    },
    {
      $addToSet : {              // by using push it will send the duplicated data
        authors  : req.body.newAuthor
      }
    },
    {
      new: true
    }
  );
  // updated author database
  const  updatedAuthor = await AuthorModel.findOneAndUpdate ( 
    {
     id : req.body.newAuthor
    },
    {
      $addToSet : {
        books  : req.params.isbn
      }
    },
    {
      new: true
    }
  );

  return res.json(
    { 
      books: updatedBook, 
      author: updatedAuthor, 
      message: "New Author was added"
    })

})

// ------------------Delete Request----------------------------

/*
 Route =>             /book/delete/
 Description =>  to delete a book
 Access => public
 Parameters => isbn
 Method => delete
  */

routes.delete('/delete/:isbn', async (req, res) => {
  //  using array
  /*const updatedBookDb = db.books.filter((book) =>
    book.ISBN !== req.params.isbn
  );
  db.books = updatedBookDb;
  return res.json({ books: db.books });
  */

  // using mongoDB
  const deletedData = await BookModel.findOneAndDelete (
    {
      ISBN : req.params.isbn
    }
  );
  return res.json({ books: deletedData, message: `Book is deleted of isbn ${req.params.isbn}` });

})

/*
Route =>             /book/delete/author
Description =>  to delete an author from book and update author database as well
Access => public
Parameters => isbn, authorId
Method => delete
*/

routes.delete('/delete/author/:isbn/:authorId', async(req, res) => {
  // using array
  /*
  // update book database      {forEach is used  becoz we are not modifying the whole database}
  db.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      const newAuthorList = book.authors.filter((author) =>
        author !== parseInt(req.params.authorId)
      );
      book.authors = newAuthorList;
      return;
    }
  });


  // update author database

  db.authors.forEach((author) => {
    if (author.id === parseInt(req.params.authorId)) {
      const newBookList = author.books.filter((book) =>
        book !== req.params.isbn
      );
      author.books = newBookList;
      return;
    }
  });

  return res.json({
    book: db.books,
    author: db.authors,
    message: "Author was deleted"
  })

  */

  // using mongodb
  // update book database
  const updatedBook = await BookModel.findOneAndUpdate( 
    // update, becoz we have to chnage a single property , not the whole db 
    {
   ISBN : req.params.isbn
    },
    {
      $pull : {
        authors : parseInt(req.params.authorId)
      }
    },
    {
      new : true
    }
  )

  //  update author database  

  const updatedAuthor = await AuthorModel.findOneAndUpdate( 
    // update, becoz we have to chnage a single property , not the whole db
    {
   id : parseInt(req.params.authorId)
    },
    {
      $pull : {
        books : req.params.isbn
      }
    },
    {
      new : true
    }
  )

  return res.json({
    book: updatedBook,
    author: updatedAuthor,
    message: "Author was deleted"
  })

});


module.exports = routes;