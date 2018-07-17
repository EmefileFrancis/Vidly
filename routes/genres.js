const express = require('express');
const auth = require('../middleware/auth');
const apiDebug = require('debug')('app:api');
const {Genre, validate} = require('../models/genre');

const route = express.Router();

route.get('/', async (req, res) => {
    try{
        const genres = await Genre.find().sort('-description');
        res.send(genres);
    }
    catch(err){
        apiDebug(err);
    }
    
});

route.get('/:id', async (req, res) => {
    try{
        //const genre = genres.find( (c) => c.id === parseInt(req.params.id) );
        const genre = await Genre.findById(req.params.id );
        if(!genre){
            res.status(404).send("Genre with specified ID not found...");
        }
        res.send(genre);
    }
    catch(err){
        apiDebug(err);
    }
    
});

route.post('/', auth, async (req, res) => {
    try{
        const result = validate(req.body);
        if(result.error) return res.status(400).send(result.error.details[0].message);

        let genre = new Genre({
            name: req.body.name,
            description: req.body.description
        });

        genre = await genre.save();
        res.send(genre);
    }
    catch(err){
        apiDebug(err);
    }
    
});

route.put('/:id', async (req, res) => {

    try {
        //Validation
        const result = validate(req.body);
        if(result.error) return res.status(400).send(result.error.details[0].message);;

        const genre = await Genre.findByIdAndUpdate(req.params.id,
            { name: req.body.name, description: req.body.description },
            { new: true });
        // //Confirm if specified genre exist
        // const genre = genres.find( (c) => c.id === parseInt(req.params.id) );
        if (!genre) {
            res.status(404).send("Genre with specified ID not found...");
        }

        res.send(genre);
    }
    catch(err){
        apiDebug(err);
    }
    
});

route.delete('/:id', async (req, res) => {
    try{
        //Confirm if specified genre exist
        const genre = await Genre.findByIdAndRemove(req.params.id)
        //const genre = genres.find( (c) => c.id === parseInt(req.params.id) );
        if (!genre) {
            res.status(404).send("Genre with specified ID not found...");
            return;
        }

        // const index = genres.indexOf(genre);
        // genres.splice(index, 1);
        // console.log(genres);
        res.send(genre);
    }
    catch(err){
        apiDebug(err);
    }
    
});

module.exports = route;