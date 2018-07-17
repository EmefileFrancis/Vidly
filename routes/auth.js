const express = require('express');
const Joi = require('joi'); 
const { User } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const apiDebug = require('debug')('app:api');

const route = express.Router();

route.post('/', async(req, res) => {
    try{
        const result = validate(req.body);
        if(result.error) res.status(400).send(result.error.details[0].message);

        let user = await User.findOne({ email: req.body.email });
        if(!user) res.status(400).send("Invalid email and password.");

        const isValid = await bcrypt.compare(req.body.password, user.password);
        if(!isValid) res.status(400).send("Invalid email and password.");

        const token = user.generateAuthToken(); 
        res.send(token);
    }
    catch(err){
        apiDebug(err);
    }
});

function validate(user) {
    const schema = {
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required()
    };

    return Joi.validate(user, schema);
}

module.exports = route;