//Dependencies
const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const sequelize=require('./Utils/database');

const app=express();
//Routes
const userRoutes=require('./Routes/user');
const msgRoutes=require('./Routes/message');
const grpRoutes=require('./Routes/group');
//Models
const User=require('./Models/User');
const Message=require('./Models/message');
const Groups=require('./Models/group');
const Usergroup=require('./Models/usergroup');

app.use(bodyParser.json({ extended: false }));
app.use(cors({
    origin:'*',
    credentials:true
}));
app.use('/user',userRoutes);
app.use(msgRoutes);
app.use('/group',grpRoutes);
//Relations
//One to Many
Message.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Message);

Message.belongsTo(Groups,{ constraints: true, onDelete: 'CASCADE' });
Groups.hasMany(Message);
//Many to Many
User.belongsToMany(Groups,{through:Usergroup});
Groups.belongsToMany(User,{through:Usergroup});   

sequelize
//.sync({force:true})
.sync()
.then((result) => {
    app.listen(process.env.PORT);
}).catch((err) => {
    console.log(err)
});
