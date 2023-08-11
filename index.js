const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {PORT} = require('./config');
const routes = require('./routes')

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(routes);


app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`);
});
