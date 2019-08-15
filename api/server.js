const express = require('express');

const server = express();

server.use(express.json());

const userDb = require('./users/userDb.js');
const postDb = require('./posts/postDb');

//Add Middleware below
// logger() (Global Middleware)
function logger(req, res, next) {
    console.log(
        `[${new Date().toISOString()}] ${req.method} to ${req.url}`
    );

    next();
}

server.use(logger); //invoke logger middleware

//specific to  requests that expect user id param:
// validateUserId()
function validateUserId(req, res, next) {
    const { id } = req.params;

    userDb.getById(id)
    .then( user => {
        if (user) {
            next();
        } else {
            res.status(400).json({
                message: 'invalid user id'
            })
        } 
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: 'Error processing request'
        });
    });
}

// validateUser()
function validateUser(req, res, next) {
    if( req.body && Object.keys(req.body).length > 0) {
        next();
    } else if (req.body.name.length === 0 ){
        res.status(400).json({
            message: "missing required name field"
        })
    } else {
        res.status(400).json({
            message: "missing user data" 
        });
    }
}

// validatePost()
function validatePost(req, res, next) {
    if( req.body && Object.keys(req.body).length > 0) {
        next();
    } else if (req.body.text.length === 0 ){
        res.status(400).json({
            message: "missing required text field"
        })
    } else {
        res.status(400).json({
            message: "missing post data" 
        });
    }
}

//


module.exports = server;