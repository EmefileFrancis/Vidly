const mongoose = require('mongoose');
const express = require('express');
const {Customer, validateCustomer} = require('../models/customer');
const apiDebug = require('debug')('app:api');

const route = express.Router();

route.get('/', async (req, res) => {
    try{
        const customers = await Customer.find().sort('name');
        res.send(customers);
    }
    catch(err){
        apiDebug(err.message);
    }
});

route.get('/:id', async (req, res) => {
    try{
        const customer = await Customer.findById(req.params.id);
        if(!customer) res.status(404).send('Customer with specified id not found.');
        res.send(customer);
    }
    catch(err) {
        apiDebug(err.message);
    }
    
});

route.post('/', async (req, res) => {
    
    try{

        const result = validate(req.body);
        if(result.error) return res.status(400).send(result.error.details[0].message);

        let customer = new Customer({
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        });
    
        customer = await customer.save(customer);
        res.send(customer);
    }
    catch (err) {
        apiDebug(err.message);
    }
});

route.put('/:id', async (req, res) => {
    

    try{

        const result = validate(req.body);
        if(result.error) return res.status(400).send(result.error.details[0].message);

        const customer = await Customer.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        }, {new: true});
    
        if(!customer) res.status(404).send("Customer with specified id not found.")
    
        res.send(customer);
    }
    catch(err) {
        apiDebug(err.message);
    }
    
});

route.delete('/:id', async (req, res) => {
    try{
        const customer = await Customer.findByIdAndRemove(req.params.id);

        if(!customer) res.status(404).send('Customer with specified id not found.');

        res.send(customer);
    }
    catch (err) {
        apiDebug(err.message);
    }
});

module.exports = route;