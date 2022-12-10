const User=require('../Models/User');
const Message=require('../Models/message');
const {Op} = require('sequelize');


exports.addMsg=async(req,res)=>{
    const Msg=req.body.msg;
    const user=req.user;
    const groupId=req.body.groupId;
    //console.log(user.name);
    try {
        const response=await req.user.createMessage({message:Msg,groupId:groupId});
        res.json({data:response,username:user.name});
    } catch (err) {
        console.log(err);
    }
}

exports.getAllMsgs=async(req,res)=>{
    try {
        
        const groupId=req.header('Authorization');
        console.log(groupId);
        const lastMsgId=req.query.id||-1;
        //console.log(lastMsgId);
        const msgs=await Message.findAll( {include: {
            model: User,
            as: 'user',
            attributes: ['name']
        }, where:{
            groupId:groupId,
            id:
            {
                [Op.gt]: lastMsgId
            }
        } 
       
    });
        //console.log(msgs);
        res.json(msgs);
    } catch (err) {
        console.log(err);
    }
}