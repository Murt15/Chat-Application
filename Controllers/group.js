const User=require('../Models/User');
const Group=require('../Models/group');
const userGroup=require('../Models/usergroup');


exports.createGroup=async(req,res)=>{
    try {
        //console.log(req.body.id.length);
        const response=await Group.create({name:req.body.name});
        //console.log(res.id);
         for(let i=0;i<req.body.id.length;i++){
                userGroup.create({userId:req.body.id[i],groupId:response.id})
         }
         res.json({success:true})    
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
        res.json(response);
    } catch (err) {
        console.log(err);
    }
}