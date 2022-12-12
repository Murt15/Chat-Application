const User=require('../Models/User');
const Group=require('../Models/group');
const userGroup=require('../Models/usergroup');
const { v4: uuidv4 } = require('uuid');



exports.createGroup=async(req,res)=>{
    try {
        const groupUrl = req.body.name + '/' + uuidv4();
        //console.log(req.body.id.length);
        console.log(req.body);
        const response=await Group.create({name:req.body.name,groupUrl:groupUrl});
        //console.log(res.id);
        //  for(let i=0;i<req.body.id.length;i++){
        //         userGroup.create({userId:req.body.id[i],groupId:response.id})
        //  }
         userGroup.create({isAdmin:true,userId:req.user.id,groupId:response.id});
         res.json({success: true, user: req.user, group: response.dataValues});   
    } catch (err) {
        console.log(err);
    }
}
exports.joinGroup=async(req,res)=>{
    try {
        const group=await Group.findOne({where:{groupUrl:req.body.Url}});
        if(!group) {
            res.status(404).json({message: 'group doesnt exists'});
            res.end();
        }
        await userGroup.create({
            isAdmin:false,  
            groupId: group.dataValues.id, 
            userId: req.user.id 
        });
        res.json({success:true,group})

    } catch (err) {
        console.log(err);
    }
}

exports.getAllGroups=async(req,res)=>{
    try {
        //console.log(req.user.id);
        const usergrp = await userGroup.findAll({where:{userId:req.user.id}});
        //console.log(usergrp);
        const idArray=[];
        for(let i=0;i<usergrp.length;i++){
            idArray.push(usergrp[i].groupId)
        }
        //console.log(idArray);

        const response=await Group.findAll({where:{id:idArray}})
        res.json({data:response,usergrp});
    } catch (err) {
        console.log(err);
    }
}

exports.adminDetails=async(req,res)=>{
    try {
        const userId=req.user.id
        const groupId=req.body.id;
        //console.log(userId,groupId);
        const response= await userGroup.findAll({where:{groupId:groupId,userId:userId}});
        
         res.json(response);

        // if(response){
        //     res.json({success:true});
        //     //console.log(response);
        // }else{
        //     res.json({success:false});
        // }
        
    } catch (err) {
        console.log(err);
    }
}

exports.getAllUseroftheGrp=async(req,res)=>{
    try {
        const groupId=req.header('Authorization');
        //console.log(groupId);
        const users=await userGroup.findAll({where:{groupId:groupId}})
        //console.log(users);
        const useridArr=[];
        for(let i=0;i<users.length;i++){
            useridArr.push(users[i].userId)
        }
        //console.log(useridArr);
        const userResponse=await User.findAll({where:{id:useridArr}})
        res.json(userResponse);
        //res.json(users)
    } catch (err) {
        console.log(err)
    }
    
}

exports.makeAdmin=async(req,res)=>{
    const userId=req.body.userId;
    const groupId=req.body.groupId;

    const user=await userGroup.findOne({where:{userId:userId,groupId:groupId}})
    await user.update({isAdmin:true});
    console.log("Done")
    res.status(202).json({success:true})
}

exports.removeUser=async(req,res)=>{
    const userId=req.body.userId;
    const groupId=req.body.groupId;
    const user=await userGroup.findOne({where:{userId:userId,groupId:groupId}})

    const response=user.destroy();
    console.log("Deleted");
    res.status(202).json({success:true})
}