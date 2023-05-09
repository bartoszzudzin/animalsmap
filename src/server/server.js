const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

mongoose.set('strictQuery', false);

const app = express();
const getData = require('./getData');
const setData = require('./setData');

app.use(cors());
app.use(cookieParser());

const PORT = 5000;
const uri = "mongodb+srv://zudzinbartosz:1567232--yY@cluster0.pfqdljf.mongodb.net/test?retryWrites=true&w=majority"

const store = new MongoDBStore({
    uri: uri,
    collection: 'sessions'
});
  
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: store, // przechowuj sesję w MongoDBStore
    cookie: {
      maxAge: 3600000 // czas trwania sesji w milisekundach
    }
}));


// ustawienie limitu na 10 MB
const jsonParser = bodyParser.json({ limit: '100mb' });
const urlencodedParser = bodyParser.urlencoded({ limit: '100mb', extended: false });

// użyj parserów do przetwarzania żądań
app.use(jsonParser);
app.use(urlencodedParser);;

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
    addedBy: {type: String, required: false},
    nickname: {type: String, required: false},
})

const UsersScheme = new mongoose.Schema({
    id: {type: Number, required: false},
    email: {type: String, required: false},
    nickname: {type: String, required: false},
    password: {type: String, required: false},
    friends: {type: Array, required: false},
    avatar: {type: String, required: false},
})

const MessagesScheme = new mongoose.Schema({
    from: {type: String, required: false},
    to: {type: String, required: false},
    messages: {type: Array, required: false},
})

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Połączono z bazą danych AnimalsMap'))
    .catch(err => console.log(err));

getData(app, mongoose, MarkersScheme, UsersScheme, MessagesScheme);
setData(app, MarkersScheme, bodyParser, UsersScheme, MessagesScheme);
