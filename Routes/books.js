const express = require('express');
const routes = express.Router();

// database 
const db = require('../database/index')

//  get routes-----------------------------------------------------

/*
Route =>             /books
Description =>  to get all books
Access => public
Parameters => none
Method => get
 */
routes.get('/books',(req, res)=>{
    return res.json({books: db.books});
})


/*
Route =>             /book
Description =>  to get a specific book
Access => public
Parameters => isbn
Method => get
 */

routes.get('/book/:isbn',(req, res)=>{
    const getBook = db.books.filter(
        (book)=> book.ISBN === req.params.isbn
    );
    if(getBook.length === 0){
      return  res.json({error: `No book found for the ISBN of ${req.params.isbn}`})
    }

    return res.json({book : getBook});
})

/*
Route =>             /c
Description =>  to get a specific book based on category
Access => public
Parameters => category
Method => get
 */

routes.get('/c/:category',(req, res)=>{
    const getBooks = db.books.filter(
        (book)=> book.category.includes(req.params.category)
    );
    if(getBooks.length === 0){
      return  res.json({error: `No book found for the category of ${req.params.category}`})
    }

    return res.json({book : getBooks});
})

/*
Route =>             /a
Description =>  to get a specific book based on authors
Access => public
Parameters => author
Method => get
 */

routes.get('/a/:author',(req, res)=>{
    
    const getBooks = db.books.filter(
        (book)=> book.authors.includes(parseInt(req.params.author))
    );
    if(getBooks.length === 0){
      return  res.json({error: `No book found for the author ${req.params.author}`})
    }

    return res.json({book : getBooks});
})

//  --------------------------post requests-----------------------


/*
Route =>             /book/new
Description =>  to add a new book
Access => public
Parameters => none
Method => post
 */

routes.post('/book/new', (req,res)=>{
    const {newBook} = req.body;
    console.log(req.body);
    db.books.push(newBook);
    return res.json({books: db.books , message:"Book was added"})
 })
 
//  --------------------------put requests-----------------------


/*
Route =>             /book/update/
Description =>  to update book details (title)
Access => public
Parameters => isbn
Method => put
 */

routes.put('/book/update/:isbn',(req,res)=>{
  db.books.forEach( (book)=>{
   if(book.ISBN === req.params.isbn){
       book.title = req.body.bookTitle;
       return;
   }
  });
  return res.json({book: db.books})
})


/*
Route =>             /book/author/update/:isbn
Description =>  to update or add new author
Access => public
Parameters => isbn
Method => put
*/
routes.put('/book/author/update/:isbn',(req,res)=>{
    // update book database -> book should be created before
    db.books.forEach( (book)=>{
       if(book.ISBN === req.params.isbn){
           return book.authors.push(req.body.newAuthor);
       }
    })
    // update author database -> author should be created before
    db.authors.forEach( (author)=>{
        if(author.id === req.body.newAuthor){
            return author.books.push(req.params.isbn);
        }
    })

    return res.json({books:db.books, author:db.authors, message: "New Author was added"})
})



module.exports = routes;