const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');  
var User = require('../../models/index')

var JWT_SECRET = 'Gli7dFsW-J_82cO-Ed_s_ODeDpAFASPD-ge3qLuI6qT6krM3KjOtTsPysR2PkiP9yUdiJrTLwpeNtEaDhwyQmybGTsUTZ1bxZnZ5bWF9_nW7Tfex6lJxQi1Vwq68RTfzie6xa_N7muxISpLCYd8g_c_zOJcmyjkCdZAW5z0LFBZB9icGmJuOMv-VldgroKxJeIh88jEBWWR3eGGU9ZzprnzH6Wi_GONq2q0DELDzDAjmJDelfK1hBOY2vaSfa0lIlZEhLe2YsFwBAMtuqqBnhT3rxGBWkxq2QhN6Wp2bvuhaYC8-_eoKBBeEW31qz2Z6VDbrtuFZXOXZ9iBs9NCAUQ',



const createUser = function(req,res,next){
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

const userSignin = (req,res)=>{
    var user = req.body.user;

    if(req.cookies.token){
        return res.redirect('/home');
    }
    User.findOne({email: user.email}, function(error,old_user){
        if(error){
            return res.send({
                type:"Error",
                message:"No user has found"
            })
        }
        if(!old_user){
            return res.send({
                type:"error",
                message:"Incorrect Password or mail"
            })
        }
        else if(old_user){
            if(bcrypt.compareSync(user.password,old_user.password))
            {
                var token = jwt.sign({user_id:user._id},JWT_SECRET, {expiresIn: (24*60*60) });
                res.cookie('token',token);
                return res.send({
                    type:"Success",
                    message:"User successfully logged in"
                })
            }
            else
            return res.send({
                type:"Error",
                message:"No user found or incorrect email"
            })
 
        }
    })
}

const getAllUser = (req,res)=>{
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

const updateUser = (req,res)=>{
    var user = req.body.user;
    if(!user.user_id){
        return res.send({
            type:"error",
            message:"No user id found"
        })
    }
    User.findById(user.user_id)
    .exec(function(error,user_found){
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

const deleteUser = (req,res)=>{
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
    .exec(function(error,user){
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

var userChecker = (req, res, next) => {
    if (req.cookies.token) {
        jwt.verify(req.cookies.token, JWT_SECRET, function(error, decoded){
            if(error){
                res.clearCookie('token')
                return res.send({
                    type:"Error",
                    code:401,
                    message:"Please sigin in your account and no jwt "
                })
            }
            else
            req.user_id = decoded.user_id;
            User.findById(req.user_id, function(err, user){
                req.user = user;
                return next();
            })
        })  
    }  
    else{
        return res.send({
            type:"error",
            message:"Please signin it"
        })
    }
}

const userSignout = (req,res)=>{
    if (req.cookies.token) {
        res.clearCookie('token');
        return res.send({
            type:"success",
            message:"User successfully signed out"
        })
    } 
}

module.exports = {
    createUser:createUser,
    getAllUser:getAllUser,
    updateUser:updateUser,
    deleteUser:deleteUser,
    userChecker:userChecker,
    userSignin:userSignin,
    userSignout:userSignout
}

