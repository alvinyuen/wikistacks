// const _ = require('lodash');  //create logger?  I can't really remember what lodash is for.
const volleyball = require('volleyball');  //logger
const express = require('express'); //require express
const app = express(); // creates an instance of an express application
const nunjucks = require('nunjucks');
const wikiRoutes = require('./routes/wiki.js');
const bodyParser = require('body-parser');
const db = require('./models/index.js');


app.set('view engine', 'html'); // have res.render work with html files
app.engine('html', nunjucks.render); // when giving html files to res.render, tell it to use nunjucks

var env = nunjucks.configure('views', {noCache: true});  // point nunjucks to the directory containing templates and
// turn off caching; configure returns an Environment instance, which we'll want to use to add Markdown support later.



app.use(volleyball);

//url-encoded & JSON parsing middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'))
app.use('/wiki', wikiRoutes);


db.Page.sync({force: false});
db.User.sync({force: false});


app.listen(3000);
console.log('server listening');