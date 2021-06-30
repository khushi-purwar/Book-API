// dotenv is a module that loads environment varibles from a .env file into process.env
require('dotenv').config();

// framework
const express = require('express');

// initializing express
const app = express();

// database
// const db = require('./database/index')
 const mongoose = require('mongoose');
// mongodb is schemaless but mongoose is not schemaless, helps in validation part

 // establish connection
 mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then( ()=>
console.log("Database connected 🤩🤩🤩")
).catch ((err)=>
console.log(err.message)
)

// configurations
app.use(express.json());

// importing bookRoutes, authorRoutes, publicationRoutes
const bookRoutes = require('./Routes/books');
const authorRoutes = require('./Routes/author');
const publicationRoutes = require('./Routes/publication');

// using the above import routes
app.use(bookRoutes)
app.use(authorRoutes);
app.use(publicationRoutes);

app.get('/',(req,res)=>{
    res.send("BOOK MANAGEMENT API");
})
// listening
app.listen(3080, ()=>{
    console.log("Server started at 3080...");
})