const express=require('express');

const router=express.Router();

const groupController=require('../Controllers/group');

const userAuthentication=require('../Middleware/authenticate');

router.post('/createGroup',userAuthentication.authenticate,groupController.createGroup);

router.get('/allgroups',userAuthentication.authenticate,groupController.getAllGroups);

router.post('/joinGroup',userAuthentication.authenticate,groupController.joinGroup);

router.post('/admindetails',userAuthentication.authenticate,groupController.adminDetails);

router.get('/allUsers',groupController.getAllUseroftheGrp);

router.post('/makeAdmin',groupController.makeAdmin);

router.post('/removeUser',groupController.removeUser);

module.exports=router;