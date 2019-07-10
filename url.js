const express = require('express');
const User = require('./routes/user/user')
const Company = require('./routes/company/company')
const app = express.Router();


app.post("/user/create",User.userChecker,User.createUser);
app.get("/user/all",User.userChecker,User.getAllUser);
app.post("/user/update",User.userChecker,User.updateUser);
app.post("/user/delete",User.userChecker,User.deleteUser);
app.post("/user/signin",User.userSignin);
app.post("/user/signout",User.userChecker,User.userSignout);


//Company Creation
//purpose of creating -> refernce the tables
app.post("/company/create",User.userChecker,Company.createCompany);
app.get("/company/all",User.userChecker,Company.getCompany)

module.exports = app;
