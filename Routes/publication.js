const express = require('express');
const routes = express.Router();

// database 
const db = require('../database/index')

//  get routes-----------------------------------------------------\

/*
Route =>             /publications
Description =>  to get all pulbications
Access => public
Parameters => none
Method => get
 */
routes.get('/publications',(req, res)=>{
    return res.json({publications: db.publications});
})

/*
Route =>             /publications
Description =>  to get a specific publication
Access => public
Parameters => id
Method => get
 */

routes.get('/publications/:id',(req, res)=>{
    const getPublication = db.publications.filter(
        (publication)=> publication.id === parseInt(req.params.id)
    );
    if(getPublication.length === 0){
      return  res.json({error: `No publication found for the ID ${req.params.id}`})
    }

    return res.json({publication : getPublication});
})

/*
Route =>             /publication
Description =>  to get a publication based on book isbn
Access => public
Parameters => isbn
Method => get
 */

routes.get('/publication/:isbn',(req, res)=>{
    const getPublications = db.publications.filter(
        (publication)=> publication.books.includes(req.params.isbn)
    );
    if(getPublications.length === 0){
      return  res.json({error: `No publication found for the ISBN of ${req.params.isbn}`})
    }

    return res.json({publications : getPublications});
})

//  post routes-----------------------------------------------------

/*
Route =>             /publication/new
Description =>  to add a new  publication
Access => public
Parameters => none
Method => post
 */

routes.post('/publication/new', (req,res)=>{
    const {newPublication} = req.body;

    db.publications.push(newPublication);
    return res.json({publications: db.publications , message:"Publication was added"})
 })

//  ----put request---------------------------------------

 /*Route =>             /publication/update/
Description =>  to update publication details (name)
Access => public
Parameters => id
Method => put
 */

routes.put('/publication/update/:id',(req,res)=>{
    db.publications.forEach( (publication)=>{
     if(publication.id === parseInt(req.params.id)){
         publication.name = req.body.publicationName;
         return;
     }
    });
    return res.json({publication: db.publications})
})

 /*Route =>             /publication/update/book/
Description =>  to update/add new book in publication
Access => public
Parameters => isbn
Method => put
 */

routes.put('/publication/update/book/:isbn',(req,res)=>{
     // update publication database 
     db.publications.forEach( (publication)=>{
        if(publication.id === req.body.pubId){
            return publication.books.push(req.params.isbn);
        }
     })
     // update book database 
     db.books.forEach( (book)=>{
         if(book.ISBN === req.params.isbn){
            book.publication = req.body.pubId;
            return;
         }
     })

     return res.json(
         {
             publications:db.publications, 
             books:db.books, 
             message: "New Publication was added"
         }
    )

})

// ------------------Delete Request----------------------------

/*
 Route =>             /publication/delete/
 Description =>  to delete a publication
 Access => public
 Parameters => id
 Method => delete
  */

 routes.delete('/publication/delete/:id',(req,res)=>{
    const updatedPublicationDb = db.publications.filter( (publication)=>
           publication.id !== parseInt(req.params.id)
    ) ;
    db.publications = updatedPublicationDb;
    return res.json({publications: db.publications});
})


/*
 Route =>             /publication/delete/book/:isbn/:id
 Description =>  to delete a book from the publication
 Access => public
 Parameters => isbn, pubId
 Method => delete
  */

routes.delete('/publication/delete/book/:isbn/:pubId', (req,res) =>{

    // update publication database
    db.publications.forEach( (publication) =>{
        if(publication.id === parseInt(req.params.pubId)){
            const newBooksList = publication.books.filter( (book) =>
            book !== req.params.isbn
            )
          publication.books = newBooksList;
        return ;
        }
    })
    // update book database
    db.books.forEach( (book)=>{
        if(book.ISBN === req.params.isbn){
            book.publication = 0;   // no publication available
            return; 
        }
    });
    return res.json({
        publication:db.publications, 
        book: db.books,
        message : "Book was deleted"
     })
})

module.exports = routes;