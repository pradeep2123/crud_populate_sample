const express = require('express');
const User = require('./routes/user/user');
const Company = require('./routes/company/company')
const app = express.Router();


app.post("/user/create",User.createUser);
app.get("/user/all",User.getAllUser);
app.post("/user/update",User.updateUser);
app.post("/user/delete",User.deleteUser);

//Company Creation
//purpose of creating -> refernce the tables
app.post("/company/create",Company.createCompany);
app.get("/company/all",Company.getCompany)

module.exports = app;
