const Sequelize = require('sequelize');

const sequelize = require('../Utils/database');


const userGroup = sequelize.define('userGroup',{
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    }, 
    isAdmin:{
        type:Sequelize.BOOLEAN,
        allowNull : false, 
        default : false
    }


})

module.exports = userGroup;