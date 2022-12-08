const User=require('../Models/User')
const bcrypt = require('bcrypt');
const saltRounds=10;
const jwt = require('jsonwebtoken');


function generateAccessToken(id) {
    return jwt.sign({ userId: id }, process.env.SECRET)
}

exports.signUpUser=async(req,res)=>{
    //console.log(req.body);

    const name=req.body.name;
    const email=req.body.email;
    const phoneNo=req.body.phoneNo;
    const password=req.body.password;
    try {
        const find=await User.findAll({where:{emailId:email}})
        if(find.length==0){
            bcrypt.hash(password, saltRounds, async function (err, hash) {
                await User.create({ name: name,phoneNo:phoneNo ,emailId: email, password: hash})
                res.json({ alreadyexisting: false })
                //console.log(err);
            });
        }else{
            res.json({ alreadyexisting: true })
        }
        
    } catch (err) {
        console.log(err);
    }

}

exports.loginUser=async(req,res)=>{
    console.log(req.body);

    const email=req.body.email;
    const password=req.body.password;

    try {

        let user = await User.findAll({ where: { emailId: email } })

        if(user.length!==0){
            bcrypt.compare(password, user[0].password, function (err, result) {
                // result == true
                if (result == true) {
                    res.json({ success: true, token: generateAccessToken(user[0].id) })
                } else {
                    res.json({ password: "incorrect" })
                }
                //console.log(err);
            });

        }else{
            res.json({ success: false });
        }




    } catch (err) {
        console.log(err);
    }
}