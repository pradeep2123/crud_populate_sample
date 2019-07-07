var express = require('express');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var url = require('./url')
mongoose.connect('mongodb://localhost:27017/crud',{useNewUrlParser:true});

var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended:true  // methods to easy
}));

app.use('/',url);
app.listen(2001,console.log('server listening'));
