 //app.js
 const express = require('express');

 const app = express();
 app.use(express.json());
 
 const methodOverride = require('method-override');
 
 app.use(methodOverride('_method'))
 
 const path = require('path');

 
 // Configurando middlewares
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));

 const initialRoutes = require('./routes/initialRoute');
 app.use('/', initialRoutes);

const baralhoRoute = require('./routes/deckRoute');
app.use('/decks', baralhoRoute);

const userRoute = require('./routes/userRoute');
app.use('/users', userRoute);

 const matchRoutes = require('./routes/matchRoute');
 app.use('/match', matchRoutes);

 const socketRoutes = require('./routes/filaRoute');
 app.use('/filadeespera', socketRoutes);

 app.use(express.static(path.join(__dirname, 'view')));
 app.use(express.static(path.join(__dirname, 'public')));
 
 module.exports = app;


//curl -X POST http://localhost:3000/users/newuser \ -H "Content-Type: application/json" \ -d "{\"name\": \"Pedrin\", \"password\": \"ankards123\"}"