const express=require('express');

const router=express.Router();

const msgController=require('../Controllers/message');

const userAuthentication=require('../Middleware/authenticate');

router.post('/message',userAuthentication.authenticate,msgController.addMsg)


module.exports=router;