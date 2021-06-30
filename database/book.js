const mongoose = require('mongoose');

// create a schema
const BookSchema = mongoose.Schema(
    {
        ISBN : String,
        title: String,
        authors : [Number],
        language : String,
        pubDate: String,
        numOfPage : Number,
        category: [String],
        publication: Number
    },
)

// create a book model

const BookModel = mongoose.model(BookSchema);

module.exports = BookModel;
