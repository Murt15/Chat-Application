const Sequelize = require('sequelize');

const sequelize = require('../Utils/database');


const User = sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    phoneNo:{
        type:Sequelize.FLOAT,
        allowNull:false
    },
    emailId: {
      type: Sequelize.STRING,
      allowNull: false,
      unique:true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
    
  });
  
  module.exports = User;