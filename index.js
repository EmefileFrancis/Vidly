const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const dbDebug = require('debug')('app:db');

const app = express();

if(!config.get('jwtPrivateKey')){
    dbDebug('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}

mongoose.connect("mongodb://localhost:27017/vidly", {useNewUrlParser: true})
    .then(() => dbDebug('connected to mongoDB'))
    .catch((err) => dbDebug(err));

app.use(express.json());
app.use('/api/v1/genres', genres);
app.use('/api/v1/customers', customers);
app.use('/api/v1/movies', movies);
app.use('/api/v1/rentals', rentals);
app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening at port ${port}`));

