const express = require('express');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const {Rental, validate} = require('../models/rental');
const {Customer, validateCustomer} = require('../models/customer');
const {Movie, validateMovie} = require('../models/movie');
const apiDebug = require('debug')('app:api');

Fawn.init(mongoose);

const route = express.Router();

route.get('/', async (req, res) => {
    try{
        const rentals = await Rental.find().sort({dateOut: -1});
        res.send(rentals);
    }
    catch(err){
        apiDebug(err);
    }
   
});

route.get('/:id', async(req, res) => {
    try{
        const rental = await Rental.findById(req.params.id);
        if(!rental) return res.status(404).send('Rental with specified id not found..');
        res.send(rental);
    }
    catch(err){
        apiDebug(err);
    }
});

route.post('/', async(req, res) => {
    try {
        const result = validate(req.body);
        if(result.error) return res.status(400).send(result.error.details[0]);

        const customer = await Customer.findById(req.body.customerId);
        if(!customer) return res.status(400).send('Invalid customer.');

        const movie = await Movie.findById(req.body.movieId);
        if(!movie) return res.status(400).send('Invalid movie.');

        if(movie.numberInStock === 0) return res.status(400).send('Movie is out of stock.');
        
        let rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        });
        // rental = await rental.save();

        // movie.numberInStock--;
        // movie.save();
        
        try{
            new Fawn.Task()
                .save('rentals', rental)
                .update('movies', { _id: movie._id }, {
                    $inc: { numberInStock: -1 }
                })
                .run()
            res.send(rental); 
        }
        catch(ex){
            res.status(500).send('Something failed.')
        }
    }
    catch(err){
        apiDebug(err);
    }
});

module.exports = route;




