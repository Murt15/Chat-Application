//Dependencies
const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const sequelize=require('./Utils/database');

const app=express();

const userRoutes=require('./Routes/user');



app.use(bodyParser.json({ extended: false }));
app.use(cors());
app.use('/user',userRoutes);

sequelize
//.sync({force:true})
.sync()
.then((result) => {
    app.listen(process.env.PORT);
}).catch((err) => {
    console.log(err)
});
