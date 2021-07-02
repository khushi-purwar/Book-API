const mongoose = require('mongoose');

const PublicationSchema = mongoose.Schema(
    {
        id:Number,
        name:String,
        books: [String]
    }
);

// create a publication model

const PublicationModel = mongoose.model("publications",PublicationSchema);

module.exports = PublicationModel;