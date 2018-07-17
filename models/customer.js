const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customer', mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20
    },
    isGold: Boolean,
    phone: {
        type: String,
        required: true
    }
}));

function validateCustomer(customer){
    const schema = Joi.object().keys({
        name: Joi.string().min(1).required(),
        phone: Joi.string().max(13).min(11).required(),
        isGold: Joi.required()
    });

    return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;