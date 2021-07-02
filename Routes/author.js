const express = require('express');
const routes = express.Router();

// database 
// const db = require('../database/index')
const AuthorModel = require('../database/author')

//  get routes-----------------------------------------------------

/*
Route =>             /authors
Description =>  to get all authors
Access => public
Parameters => none
Method => get
 */
routes.get('/authors', async (req, res) => {

    // usimg array
    // return res.json({authors: db.authors});

    // using mongodb
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
})

/*
Route =>             /authors
Description =>  to get a specific author
Access => public
Parameters => id
Method => get
 */

routes.get('/authors/:id', async (req, res) => {

    //  using array
    /* const getAuthor = db.authors.filter(
        (author)=> author.id === parseInt(req.params.id)
    );
    if(getAuthor.length === 0){
      return  res.json({error: `No author found for the ID ${req.params.id}`})
    }

    return res.json({author : getAuthor});
    */

    // using mongoDB
    const getAuthor = await AuthorModel.find({ id: req.params.id })

    if (!getAuthor) {
        return res.json({ error: `No author found for the id  ${req.params.id}` })
    }
    return res.json({ author: getAuthor });
})

/*
Route =>             /author
Description =>  to get a author based on book isbn
Access => public
Parameters => isbn
Method => get
 */

routes.get('/author/:isbn', async (req, res) => {
    // using array
    /*const getAuthors = db.authors.filter(
        (author)=> author.books.includes(req.params.isbn)
    );
    if(getAuthors.length === 0){
      return  res.json({error: `No author found for the ISBN of ${req.params.isbn}`})
    }

    return res.json({authors : getAuthors});
    */

    // using mongodb
    const getAuthors = await AuthorModel.find(
        {
            books: req.params.isbn
        });
    if (!getAuthors) {
        return res.json({ error: `No author found for the isbn  ${req.params.isbn}` })
    }

    return res.json({ authors: getAuthors });
})

// -----post request------------------------------------------

/*
Route =>             /author/new
Description =>  to add a new  author
Access => public
Parameters => none
Method => post
 */

routes.post('/author/new', (req, res) => {

    // using array
    // const {newAuthor} = req.body;
    // db.authors.push(newAuthor);
    // return res.json({authors: db.authors , message:"Author was added"})

    // using mongoDB
    const { newAuthor } = req.body;
    AuthorModel.create(newAuthor);
    return res.json({ message: "Author was added" })

})

//  put request -----------------------------------

/*Route =>             /author/update/
Description =>  to update book details (name)
Access => public
Parameters => id
Method => put
 */

routes.put('/author/update/:id', async (req, res) => {

    // using array
    /*db.authors.forEach( (author)=>{
     if(author.id === parseInt(req.params.id)){
         author.name = req.body.authorName;
         return;
     }
    });
    return res.json({author: db.authors})
    */
    const updatedData = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(req.params.id)
        },
        {
            name: req.body.authorName
        },
        {
            new: true
        }
    );
    res.json({ author: updatedData, messgae: "Author database was updated" })
})


// ------------------Delete Request----------------------------

/*
 Route =>             /author/delete/
 Description =>  to delete an author
 Access => public
 Parameters => id
 Method => delete
  */

routes.delete('/author/delete/:id', async (req, res) => {
    // using array
    /*const updatedAuthorDb = db.authors.filter( (author)=>
           author.id != req.params.id
    ) ;
    db.authors = updatedAuthorDb;
    return res.json({authors: db.authors});
     */
    
    // using mongoDB
    const deleteData = await AuthorModel.findOneAndDelete(
        {
            id: req.params.id
        }
    )

    res.json({ message: `Author was deleted of id ${req.params.id}` })
})


module.exports = routes;