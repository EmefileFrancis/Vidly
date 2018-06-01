const express = require('express');
const Joi = require('joi');
const route = express.Router();

const genres = [
    {
        "id": 1,
        "name": "Absurdist/Surreal/Whimsical",
        "description": ""
    },
    {
        "id": 2,
        "name": "Action",
        "description": ""
    },
    {
        "id": 3,
        "name": "Adventure",
        "description": ""
    },
    {
        "id": 4,
        "name": "Animation",
        "description": ""
    },
    {
        "id": 5,
        "name": "Comedy",
        "description": ""
    },
    {
        "id": 6,
        "name": "Crime",
        "description": ""
    },
    {
        "id": 7,
        "name": "Drama",
        "description": ""
    },
    {
        "id": 8,
        "name": "Fantasy",
        "description": ""
    },
    {
        "id": 9,
        "name": "Historical",
        "description": ""
    },
    {
        "id": 10,
        "name": "Historical fiction",
        "description": ""
    },
    {
        "id": 11,
        "name": "Horror",
        "description": ""
    },
    {
        "id": 12,
        "name": "Magical realism",
        "description": ""
    },
    {
        "id": 13,
        "name": "Mystery",
        "description": ""
    },
    {
        "id": 14,
        "name": "Paranoid Fiction",
        "description": ""
    },
    {
        "id": 15,
        "name": "Philosophical",
        "description": ""
    },
    {
        "id": 16,
        "name": "Political",
        "description": ""
    },
    {
        "id": 17,
        "name": "Romance",
        "description": ""
    },
    {
        "id": 18,
        "name": "Saga",
        "description": ""
    },
    {
        "id": 19,
        "name": "Satire",
        "description": ""
    },
    {
        "id": 20,
        "name": "Science fiction",
        "description": ""
    },
    {
        "id": 21,
        "name": "Slice of Life",
        "description": ""
    },
    {
        "id": 22,
        "name": "Social",
        "description": ""
    },
    {
        "id": 23,
        "name": "Speculative",
        "description": ""
    },
    {
        "id": 24,
        "name": "Thriller",
        "description": ""
    },
    {
        "id": 25,
        "name": "Urban",
        "description": ""
    },
    {
        "id": 26,
        "name": "Western",
        "description": ""
    }
    
];

route.get('/', (req, res) => {
    res.send(genres);
});

route.get('/:id', (req, res) => {
    const genre = genres.find( (c) => c.id === parseInt(req.params.id) );
    if(!genre){
        res.status(404).send("Genre with specified ID not found...");
    }
    res.send(genre);
});

route.post('/', (req, res) => {
    const newGenre = {
        "id": genres.length + 1,
        "name": req.body.name,
        "description": req.body.description
    }
    
    validateGenre(req.body, res);

    genres.push(newGenre);
    res.send(newGenre);
});

route.put('/:id', (req, res) => {
    //Confirm if specified genre exist
    const genre = genres.find( (c) => c.id === parseInt(req.params.id) );
    if(!genre){
        res.status(404).send("Genre with specified ID not found...");
    }

    //Validation
    validateGenre(req.body, res);

    genre.name = req.body.name;
    genre.description = req.body.description;

    res.send(genre);
});

route.delete('/:id', (req, res) => {
    //Confirm if specified genre exist
    const genre = genres.find( (c) => c.id === parseInt(req.params.id) );
    if(!genre){
        res.status(404).send("Genre with specified ID not found...");
        return;
    }

    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    console.log(genres);
    res.send(genre);
});

function validateGenre(reqBody, resp){
    const schema = Joi.object().keys({
        name: Joi.string().min(1).required(),
        description: Joi.string().min(1).max(20).required()
    });

    Joi.validate(reqBody, schema, function(err, value){
        console.log(err);
        if(err !== null){
            resp.status(400).send(err);
            return;
        }
        
    });
}

module.exports = route;