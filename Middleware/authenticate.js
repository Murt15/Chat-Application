const jwt=require('jsonwebtoken');

const User=require('../Models/User');

exports.authenticate=async (req,res,next)=>{
    try{
        const token=req.header('Authorization');
        //console.log(token);
        const user=jwt.verify(token,process.env.SECRET)
        //console.log(user);
        const user1=await User.findByPk(user.userId)
        //console.log(user1);
        req.user=user1
        next();
    }catch(err){
        console.log(err);
    }
}
