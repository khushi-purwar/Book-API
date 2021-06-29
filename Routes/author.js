const express = require('express');
const routes = express.Router();

// database 
const db = require('../database/index')

//  get routes-----------------------------------------------------

/*
Route =>             /authors
Description =>  to get all authors
Access => public
Parameters => none
Method => get
 */
routes.get('/authors',(req, res)=>{
    return res.json({authors: db.authors});
})

/*
Route =>             /authors
Description =>  to get a specific author
Access => public
Parameters => id
Method => get
 */

routes.get('/authors/:id',(req, res)=>{
    const getAuthor = db.authors.filter(
        (author)=> author.id === parseInt(req.params.id)
    );
    if(getAuthor.length === 0){
      return  res.json({error: `No author found for the ID ${req.params.id}`})
    }

    return res.json({author : getAuthor});
})

/*
Route =>             /author
Description =>  to get a author based on book isbn
Access => public
Parameters => isbn
Method => get
 */

routes.get('/author/:isbn',(req, res)=>{
    const getAuthors = db.authors.filter(
        (author)=> author.books.includes(req.params.isbn)
    );
    if(getAuthors.length === 0){
      return  res.json({error: `No author found for the ISBN of ${req.params.isbn}`})
    }

    return res.json({authors : getAuthors});
})


module.exports = routes;