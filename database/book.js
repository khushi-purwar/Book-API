const mongoose = require('mongoose');

// create a schema
const BookSchema = mongoose.Schema(
    {
        ISBN : {
            type: String,
            required : true,
            minlength :8,
            maxlength:10
        },
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

const BookModel = mongoose.model("books",BookSchema);

module.exports = BookModel;
