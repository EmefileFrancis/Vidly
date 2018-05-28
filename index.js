const express = require('express');
const Joi = require('joi');

const app = express();

app.use(express.json());

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

app.get('/api/genres', (req, res) => {
    res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find( (c) => c.id === parseInt(req.params.id) );
    if(!genre){
        res.status(404).send("Genre with specified ID not found...");
    }
    res.send(genre);
});

app.post('/api/genres/', (req, res) => {
    const newGenre = {
        "id": genres.length + 1,
        "name": req.body.name,
        "description": req.body.description
    }
    
    genres.push(newGenre);
    res.send(newGenre);
});

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening at port ${port}`));
