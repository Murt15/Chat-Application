//Dependencies
const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const sequelize=require('./Utils/database');

const app=express();
//Routes
const userRoutes=require('./Routes/user');
const msgRoutes=require('./Routes/message');
//Models
const User=require('./Models/User');
const Message=require('./Models/message')

app.use(bodyParser.json({ extended: false }));
app.use(cors({
    origin:'*',
    credentials:true
}));
app.use('/user',userRoutes);
app.use(msgRoutes);
//Relations
//One to Many
Message.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Message);   

sequelize
//.sync({force:true})
.sync()
.then((result) => {
    app.listen(process.env.PORT);
}).catch((err) => {
    console.log(err)
});
