const express = require('express');
const route = require('./routes/genres');

const app = express();

app.use(express.json());
app.use('/api/genres', route);

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening at port ${port}`));

