require("dotenv").config();
const mongoose = require("mongoose");
const crypto = require('crypto');
const Jobs = require("../data/job-model");
const getALl = function(req,res){
    let count = process.env.DEFAULT_JOB_LIMIT;
    let offset = 0;
    let dateObject = {};
    if(req.query && req.query.ltm){
        let currentDate = new Date(Date.now());
        let filterDate = new Date(currentDate.setMonth(currentDate.getMonth()-parseInt(req.query.ltm)));
        dateObject = {
            postDate: {
                $gte: filterDate
            }
        }
    }
    if(req.query && req.query.count){
        count = parseInt(req.query.count,10);
    }
    if(req.query && req.query.offset){
        offset = parseInt(req.query.offset,10);
    }
    if(isNaN(count) && isNaN(offset)){
        res.status(400).json({"message":process.env.INVALID_COUNT_MSG})
        return;
    }
    Jobs.find(dateObject).skip(offset).limit(count).exec(function(err,job){
        const response = {
            status : 200,
            message : job
        }
        if(err){
            response.status = 500;
            response.message = err;
        }
        res.status(response.status).json(response.message);
    })
}
const createOne = function(req,res){
    console.log(typeof req.body.salary);
    const job = {
        title : req.body.title,
        salary : encrypt(req.body.salary),
        location : req.body.location,
        description : req.body.description,
        experience : req.body.experience,
        skills : req.body.skills,
        postDate : req.body.postDate,
        reviews : []
    }
    Jobs.create(job,function(err,job){
        const response = {
            status : 201,
            message : job
        }
        if(err){
            response.status = 400;
            response.message = err; 
        }
        res.status(response.status).json(response.message);
    })
}
const deleteOne = function(req,res){
    const jobId = req.params.jobId;
    if(!mongoose.isValidObjectId(jobId)){
        res.status(400).json({"message":process.env.INVALID_OBJECT_ID_MSG})
        return;
    }
    Jobs.findByIdAndDelete(jobId).exec(function(err,result){
        const response = {
            status : 200,
            message : result
        }
        if(err){
            response.status = 500;
            response.message = err;
        }
        res.status(response.status).json(response.message);
    })
}
const partialUpdateOne = function(req,res){
    updateOne(req,res,_partialUpdateOne);
}
const fullUpdateOne = function(req,res){
    updateOne(req,res,_fullUpdateOne);
}
const updateOne = function(req,res,updateJobCallBack){
    const jobId = req.params.jobId;
    if(!mongoose.isValidObjectId(jobId)){
        res.status(400).json({"message":process.env.INVALID_OBJECT_ID_MSG})
        return;
    }
    Jobs.findById(jobId).exec(function(err,job){
        const response = {
            status : 200,
            message : job
        }
        if(err){
            response.status = 500;
            response.message = err;
        }
        if(!job){
            response.status = 400;
            response.message = {"message" : process.env.JOB_NOT_FOUND_MSG}
        }
        if(response.status !== 200){
            res.status(response.status).json(response.message);
        }else{
            updateJobCallBack(req,res,job,response);
        }
    })
}
function _partialUpdateOne(req,res,job,response){
    if(req.body.title){job.title = req.body.title}
    if(req.body.salary){job.salary = req.body.salary}
    if(req.body.location){job.location = req.body.location}
    if(req.body.description){job.description = req.body.description}
    if(req.body.experience){job.experience = req.body.experience}
    if(req.body.skills){job.skills = req.body.skills}
    if(req.body.postDate){job.postDate = req.body.postDate}
    job.save(function(err,updatedJob){
        const response = {
            status : 200,
            message : updatedJob
        }
        if(err) {
            response.status = 500;
            response.message = err;
        }
        res.status(response.status).json(response.message)
    })
}
function encrypt(text){
    var cipher = crypto.createCipher('aes-256-cbc', process.env.SERVER_SECRET);
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
  } 
  
function decrypt(text){
    if (text === null || typeof text === 'undefined') {return text;};
    var decipher = crypto.createDecipher('aes-256-cbc', process.env.SERVER_SECRET);
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
}
function _fullUpdateOne(req,res,job,response){
    job.title = req.body.title;
    job.salary = req.body.salary;
    job.location = req.body.location;
    job.description = req.body.description;
    job.experience = req.body.experience;
    job.skills = req.body.skills;
    job.postDate = req.body.postDate;
    job.save(function(err,updatedJob){
        const response = {
            status : 200,
            message : updatedJob
        }
        if(err){
            response.status = 500;
            response.message = err;
        }
        res.status(response.status).json(response.message);
    })
}
module.exports = {
    getALl,
    createOne,
    deleteOne,
    fullUpdateOne,
    partialUpdateOne
}
