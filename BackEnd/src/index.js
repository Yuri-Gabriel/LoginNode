require('dotenv/config');

const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes/routes');


const port = process.env.API_Port;

app.use(cors());
app.use(express.json());
app.use('/', routes);

app.listen(port, () => {
    console.log(`Server rodando na porta: ${port}`);
});
