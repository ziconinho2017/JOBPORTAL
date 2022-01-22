require("dotenv").config();
const mongoose = require("mongoose");
const reviewSchema = mongoose.Schema({
    date : {
        type : Date,
        "default" : Date.now
    },
    reviewText : {
        type : String,
        required : true
    },
    nameOfReviewer : String
})
const jobScheme = mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    salary : {
        type : String,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    description : String,
    experience : {
        type : String,
        "default" : "0 years"
    },
    skills : [String],
    postDate : {
        type : Date,
        "default" : Date.now
    },
    reviews :[reviewSchema]
})
module.exports = mongoose.model('Job',jobScheme,'jobs')