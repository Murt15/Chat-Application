const express=require('express');

const router=express.Router();

const groupController=require('../Controllers/group');

const userAuthentication=require('../Middleware/authenticate');

router.post('/createGroup',groupController.createGroup);

router.get('/allgroups',userAuthentication.authenticate,groupController.getAllGroups);
module.exports=router;