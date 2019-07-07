const mongoose = require('mongoose');
var  Schema = mongoose.Schema

var userSchema = new Schema({
    first_name :{type:String, required:true},
    last_name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    company:{type:Schema.Types.ObjectId, ref:'company'}
},{timestamps:true})

var companySchema = new Schema({
    company_id:{type:Number},
    company_name:{type:String},
    email:{type:String}
},{timestamps:true})

module.exports ={
    User: mongoose.model('user',userSchema),
    Company: mongoose.model('company',companySchema)
}