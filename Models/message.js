const Sequelize = require('sequelize');

const sequelize = require('../Utils/database');


const Message = sequelize.define('message',{
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },

    message: {
        type: Sequelize.TEXT,
        allowNull: false
    }

})

module.exports = Message;