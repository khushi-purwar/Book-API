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


module.exports = routes;