const express=require('express');

const router=express.Router();

const userController=require('../Controllers/user');

router.post('/signup',userController.signUpUser)


module.exports=router;