const { Movie, validateMovie} = require('../models/movie');
const { Genre } = require('../models/genre');
const express = require('express');
const route = express.Router();
const apiDebug = require('debug')('app:api');

route.get('/', async (req, res) => {
    try{
        const movies = await Movie.find()
                .sort({name: 1});
        res.send(movies);
    }
    catch(err){
        apiDebug(err);
    }
});

route.get('/:id', async (req, res) => {
    try{
        const movie = await Movie.findById({id: req.params.id});
        if(!movie) res.status(404).send('Movie with the specified id was not found.')
        res.send(movie);
    }
    catch(err){
        apiDebug(err);
    }
});

route.post('/', async (req, res) => {
    try{
        apiDebug("Inside the method...");
        const result = validateMovie(req.body);
        if(result.error) return res.status(400).send(result.error.details[0].message);

        const genre = Genre.findById(req.body.genreId);
        if(!genre) return res.status(404).send('Invalid Genre..');
          
        let movie = new Movie({
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name,
                description: genre.description
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });

        movie = await movie.save();
        res.send(movie);
    }
    catch(err){
        apiDebug(err);
    }
});

route.put('/:id', async (req, res) => {
    try{
        const result = validateMovie(req.body);
        if(result.error) apiDebug(result.error);

        const movie = await Movie.findByIdAndUpdate(req.params.id,
            {
                title: req.body.title, 
                genre: req.body.genre,
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate
            }, {new: true}
        );
        res.send(movie);
    }
    catch(err){
        apiDebug(err);
    }
});

route.delete('/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndRemove(req.params.id);
        if(!movie) res.status(404).send('Movie with the specified id not found...');

        res.send(movie);
    }
    catch(err){
        apiDebug(err);
    }
});

module.exports = route;

