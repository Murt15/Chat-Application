const express=require('express');

const router=express.Router();

const userController=require('../Controllers/user');

router.post('/signup',userController.signUpUser);

router.post('/login',userController.loginUser);

router.get('/allUsers',userController.getAlluser);


module.exports=router;