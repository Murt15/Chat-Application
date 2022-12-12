const User=require('../Models/User');
const Message=require('../Models/message');
const {Op} = require('sequelize');
const AWS=require('aws-sdk');

async   function uploadToS3(data,filename){
    const BUCKET_NAME='webchatapplication';
    const IAM_USER_KEY='AKIAX2RUSYM3JI4KM3FS';
    const IAM_USER_SECRET='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';


    let s3bucket=new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET,
        //Bucket:BUCKET_NAME
    })

    // s3bucket.createBucket(()=>{
        
    // })
    var params={
        Bucket:BUCKET_NAME,
        Key:filename,
        Body:data,
        ACL:'public-read'
    }
    s3bucket.upload(params,(err,s3response)=>{
        if(err){
            console.log(err);

        }else{
            console.log('success',s3response);
        }
    })
}

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