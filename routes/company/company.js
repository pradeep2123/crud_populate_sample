var Company = require('../../models/index').Company

const createCompany = (req,res,next)=>{
    var company = req.body.company
    Company.findOne({company_email:company.email})
    .exec((error,retrieved_company)=>{
        if(error){
            return res.send({
                type:"error",
                message:"Error occured on Company",
                data:error
            })
        }
        if(retrieved_company){
            return res.send({
                type:"Success",
                message:"Company already created"
            })
        }
        if(!retrieved_company){
            Company.create({
                company_name:company.company_name,
                company_email:company.company_email
            })
            .then(function(company_created){
                return res.send({
                    type:"Success",
                    message:"Company created",
                    data:company_created
                })
            })
            .catch(function(error){
                return res.send({
                    type:error,
                    message:"Error in creating company",
                    data:error
                })
            })
        }
    })
}

const getCompany = (req,res,next)=>{
    Company.find({})
    .exec((error,all_companies)=>{
        if(error){
            return res.send({type:"error",message:"No companies found",error:error})
        }
        if(all_companies){
            if(all_companies.length==0){
                return res.send({
                    type:"Success",
                    message:"No data's found ",
                    data:all_companies
                })
            }
            return res.send({
                type:"Success",
                message:"Companies retrieved successfully",
                data:all_companies
            })
        }
    })
}

module.exports = {
    createCompany:createCompany,
    getCompany:getCompany
}