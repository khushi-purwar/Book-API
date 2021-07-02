const express = require('express');
const routes = express.Router();

// database 
// const db = require('../database/index')
const PublicationModel = require('../database/publication')
const BookModel = require('../database/book');

//  get routes-----------------------------------------------------\

/*
Route =>             /publications
Description =>  to get all pulbications
Access => public
Parameters => none
Method => get
 */
routes.get('/publications',async(req, res)=>{

    // using array
    // return res.json({publications: db.publications});

    //  using mongoDB
    const getAllPublication = await PublicationModel.find();
    return res.json(getAllPublication);
})

/*
Route =>             /publications
Description =>  to get a specific publication
Access => public
Parameters => id
Method => get
 */

routes.get('/publication/:id',async(req, res)=>{
    // using array
    /*const getPublication = db.publications.filter(
        (publication)=> publication.id === parseInt(req.params.id)
    );
    if(getPublication.length === 0){
      return  res.json({error: `No publication found for the ID ${req.params.id}`})
    }
    return res.json({publication : getPublication});
    */

    // usimg mongoDB
    const getPublication = await PublicationModel.find(
        {
            id: parseInt(req.params.id)
        }
    )
    return res.json({publication : getPublication});
})

/*
Route =>             /publication
Description =>  to get a publication based on book isbn
Access => public
Parameters => isbn
Method => get
 */

routes.get('/publications/:isbn', async(req, res)=>{

    // using array
    /*const getPublications = db.publications.filter(
        (publication)=> publication.books.includes(req.params.isbn)
    );
    if(getPublications.length === 0){
      return  res.json({error: `No publication found for the ISBN of ${req.params.isbn}`})
    }
    return res.json({publications : getPublications});*/

    const getPublications = await PublicationModel.find(
        { 
            books: req.params.isbn
        }
    );
    res.json({publications : getPublications});
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
    
    //  using array
    // const {newPublication} = req.body;
    // db.publications.push(newPublication);
    // return res.json({publications: db.publications , message:"Publication was added"})

    //  using mongoDB
    const { newPublication } = req.body;
    PublicationModel.create(newPublication);
  
    return res.json({ message: "Publication was added" })
 })

//  ----put request---------------------------------------

 /*Route =>             /publication/update/
Description =>  to update publication details (name)
Access => public
Parameters => id
Method => put
 */

routes.put('/publication/update/:id',async(req,res)=>{
    // using array
    /*db.publications.forEach( (publication)=>{
     if(publication.id === parseInt(req.params.id)){
         publication.name = req.body.publicationName;
         return;
     }
    });
    return res.json({publication: db.publications})*/

    // using mongodb
    const updatedPub = await PublicationModel.findOneAndUpdate(
        {
            id: parseInt(req.params.id)
        },
        {
            name : req.body.publicationName
        },
        {
            new: true
        }
    );
    res.json({publication: updatedPub, message: `Publication is updated of id ${req.params.id}`})
})

 /*Route =>             /publication/update/book/
Description =>  to update/add new book in publication
Access => public
Parameters => isbn
Method => put
 */

routes.put('/publication/update/book/:isbn',async(req,res)=>{
    // using array
    /*
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
    );
    */

    // using mongoDB
    // updated publication database
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id : req.body.pubId
        },
        {
            $addToSet : {
                books : req.params.isbn
            }
        },
        {
            new: true
        }
    );
    

    // updated book database

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN : req.params.isbn
        },
        {
           publication : req.body.pubId
        },
        {
            new: true
        }
    );
    

    res.json(
        {publication : updatedPublication, 
        book : updatedBook,
        message : `publication was updated of id ${req.body.pubId}`
    });
})

// ------------------Delete Request----------------------------

/*
 Route =>             /publication/delete/
 Description =>  to delete a publication
 Access => public
 Parameters => id
 Method => delete
  */

 routes.delete('/publication/delete/:id', async(req,res)=>{
     // using array
    /*const updatedPublicationDb = db.publications.filter( (publication)=>
           publication.id !== parseInt(req.params.id)
    ) ;
    db.publications = updatedPublicationDb;
    return res.json({publications: db.publications});
    */

    // using mongoDB
    const deletePublication =  await PublicationModel.findOneAndDelete(
        {
            id: parseInt(req.params.id)
        }
    );
    res.json(
        {
            publication: deletePublication, 
            message: `publication of id ${req.params.id} was deleted`
        });
})


/*
 Route =>             /publication/delete/book/:isbn/:id
 Description =>  to delete a book from the publication
 Access => public
 Parameters => isbn, pubId
 Method => delete
  */

routes.delete('/publication/delete/book/:isbn/:pubId', async(req,res) =>{

    // using array
    /*
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
     });
     */

     // using mongoDB

     // update Publication database
     const deletedPub =  await PublicationModel.findOneAndUpdate(
         {
             id: parseInt(req.params.pubId)
         },
         {
             $pull: {
                 books : req.params.isbn
             }
         },
         {
             new: true
         }
     );

      // update Book database
      const deletedBook =  await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            publication : 0
            
        },
        {
            new: true
        }
    );

    return res.json({
        publication:deletedPub, 
        book: deletedBook,
        message : "Book was deleted"
     });
})

module.exports = routes;