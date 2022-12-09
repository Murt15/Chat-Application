const User=require('../Models/User');
const Message=require('../Models/message');
const {Op} = require('sequelize');


exports.addMsg=async(req,res)=>{
    const Msg=req.body.msg;
    const user=req.user;
    //console.log(user.name);
    try {
        const response=await req.user.createMessage({message:Msg});
        res.json({data:response,username:user.name});
    } catch (err) {
        console.log(err);
    }
}

exports.getAllMsgs=async(req,res)=>{
    try {
        const lastMsgId=req.query.id||-1;
        console.log(lastMsgId);
        const msgs=await Message.findAll( {include: {
            model: User,
            as: 'user',
            attributes: ['name']
        }, where: {
            id: {
                [Op.gt]: lastMsgId
            }
        }
    });
        res.json(msgs);
    } catch (err) {
        console.log(err);
    }
}