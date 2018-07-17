const express = require('express');
const auth = require('../middleware/auth');
const { User, validateUser } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const apiDebug = require('debug')('app:api');

const route = express.Router();

route.get('/me', auth, async (req, res) => {
    try{
        const user = await User.findById(req.user._id).select('-password');
        res.send(user);
    }
    catch(err) {
        apiDebug(err);
    }
});

route.get('/', async (req, res) => {
    try{
        const users = await User.find().sort('name');
        if(!users) res.status(404).send('No user registered on the system.');

        res.send(users);
    }
    catch(err){
        apiDebug(err);
    }
});

route.get('/:id', async(req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user) res.status(404).send('No user with the specified id found.');

        res.send(user);
    }
    catch(err){
        apiDebug(err);
    }
});

route.post('/', async(req, res) => {
    try{
        const result = validateUser(req.body);
        if(result.error) res.status(400).send(result.error.details[0].message);

        let user = await User.findOne({ email: req.body.email });
        if(user) res.status(400).send("User already registered.");

        // user = new User({
        //     name: req.body.name,
        //     email: req.body.email,
        //     password: req.body.password
        // });

        user = new User(_.pick(req.body, ['name', 'email', 'password']));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();
        //res.send(user);
        const token = user.generateAuthToken() ;
        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    }
    catch(err){
        apiDebug(err);
    }
});

route.put('/:id', async(req, res) => {
    try{
        const result = validateUser(req.body);
        if(result.error) res.status(400).send(result.error.details[0].message);

        const user = await User.findByIdAndUpdate(req.params.id, 
            { name: req.body.name, email: req.body.email, password: req.body.password}, 
            {new: true}
        );

        if(!user) res.status(404).send('User with specified id not found.');

        res.send(user);
    }
    catch(err){
        apiDebug(err);
    }
});

route.delete('/:id', async (req, res) => {
    try{
        const user = await User.findByIdAndRemove(req.params.id);

        if(!user) res.status(404).send('User with specified id not found.');

        res.send(user);
    }
    catch(err){
        apiDebug(err);
    }
});

module.exports = route;