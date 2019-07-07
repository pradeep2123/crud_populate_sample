const bcrypt = require('bcrypt-nodejs');
var User = require('../../models/index').User

const createUser = (req,res,next)=>{
    var user = req.body.user;
    var salt = bcrypt.genSaltSync(8);
    var hash = bcrypt.hashSync(user.password, salt);
    password = hash;

    User.findOne({email:user.email})
    .exec((err,old_user)=>{
        if(err){
            return res.send({
                type:"error",
                message:"Error retrieving user",
                data:err
            })
        }
        if(old_user){
            return res.send({
                type:"Success",
                message:"Already user registered",
            })
        }
        if(!old_user){
            User.create({
                first_name:user.first_name,
                last_name:user.last_name,
                email:user.email,
                password:password,
                company:user.company
            })
            .then(function(Success){
                return res.send({
                    type:"Success",
                    message:"Succsessfully created",
                    data:Success
                })
            })
            .catch(function(error){
                return res.send({
                    type:"Error",
                    message:"Error on retrieving",
                    data:error
                })
            })
        }
    })
}

const getAllUser = (req,res,next)=>{
    // var count = req.params.count || req.query.count|| 10
    // var page = req.params.page|| req.query.page|| 1;
    
    // if(page<=0){
    //     logger.info("PAGES LESS THAN ZERO");
    //     return res.send("NO USER FOUND");
    // }

    User.find({})
    // .skip((count * page)-count)
    // .limit(count)
    .populate('company','company_name')
    .then(function(user_retrive){
        if(user_retrive.length == 0){
            return res.send({
                type:"Error",
                data:user_retrive,
                message:"No User Found"
            })
        }
        // var total_users = user_retrive.length;
        // var total_pages = Math.ceil(total_users/count);
        // if(page>total_pages || count>total_users){
        //     return res.send({
        //         type:"Error",
        //         message:"No User found for page_number",  
        //     })
        // }
        return res.send({
            type:"Success",
            message:"Users are successfully listed",
            data:user_retrive
        })
    })
    .catch(function(error){
        return res.send({
            type:"error",
            message:"No users are found",
            data:error
        })
    })
}

const updateUser = (req,res,next)=>{
    var user = req.body.user;
    if(!user.user_id){
        return res.send({
            type:"error",
            message:"No user id found"
        })
    }
    User.findById(user.user_id)
    .exec((error,user_found)=>{
        if(error){
            return res.send({
                type:"Error",
                message:"No User found"
            })
        }
        if(!user_found){
            return res.send({
                type:"Error",
                message:"No User found"
            })
        }
        if(user_found){
            user_found.first_name = user.first_name;
            user_found.last_name = user.last_name;
            user_found.email = user.email;
            user_found.contact_no = user.contact_no;
            user_found.save(function(err,user_saved){
                if(err){
                    return res.send({
                        type:"Error",
                        message:"No user found saved",
                        data:err
                    })
                }else{
                    return res.send({
                        type:"Success",
                        message:"User Updated",
                        data:user_saved
                    })
                }
            })
        }

    })

}

const deleteUser = (req,res,next)=>{
    var user = req.body.user
    if(!user.user_id){
        return res.send({
            type:"Error",
            message:"No user id found"
        })
    }
    User.findOneAndDelete({
        _id:user.user_id
    })
    .exec((error,user)=>{
        console.log(user)
        if(error){
            return res.send({
                type:"Error",
                message:"no user founds"
            })
        }
        if(!user){
            return res.send({
                type:"Error",
                message:"No user found"
            })
        }
        if(user){
            return res.send({
                type:"Success",
                message:"User has been deleted",
            })
        }
    })
}

module.exports = {
    createUser:createUser,
    getAllUser:getAllUser,
    updateUser:updateUser,
    deleteUser:deleteUser
}