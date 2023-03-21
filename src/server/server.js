const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

mongoose.set('strictQuery', false);

const app = express();
const getData = require('./getData');
const setData = require('./setData');

app.use(cors());

const PORT = 5000;
const uri = process.env.MONGODB_URI;

app.use(express.json());

app.listen(PORT, () =>{
    console.log("Server is listening at", PORT);
})

const MarkersScheme = new mongoose.Schema({
    id: {type: Number, required: false},
    long: {type: Number, required: false},
    lat: {type: Number, required: false},
    street: {type: String, required: false},
    city: {type: String, required: false},
    icon: {type: Boolean, required: false},
    name: {type: String, required: false},
    race: {type: String, required: false},
    info: {type: String, required: false},
    status: {type: String, required: false},
    character: {type: String, required: false},
    contactPerson: {type: String, required: false},
    contactPhone: {type: String, required: false},
    image: { type: String, required: false },
})

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Połączono z bazą danych AnimalsMap'))
    .catch(err => console.log(err));

getData(app, mongoose, MarkersScheme);
setData(app, MarkersScheme, bodyParser);