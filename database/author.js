const mongoose = require('mongoose');

const AuthorSchema = mongoose.Schema(
    {
        id: Number,
        name : String,
        books: [String]
    },
)

// create a Author model

const AuthorModel = mongoose.model("authors",AuthorSchema);

module.exports = AuthorModel;