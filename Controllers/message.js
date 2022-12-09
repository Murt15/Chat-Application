const User=require('../Models/User');
const Message=require('../Models/message');

exports.addMsg=async(req,res)=>{
    const Msg=req.body.msg;
    try {
        const response=await req.user.createMessage({message:Msg});
        res.json(response);
    } catch (err) {
        console.log(err);
    }
}

exports.getAllMsgs=async(req,res)=>{
    try {
        const msgs=await Message.findAll();
        res.json(msgs);
    } catch (err) {
        console.log(err);
    }
}