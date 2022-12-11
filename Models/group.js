const Sequelize = require('sequelize');

const sequelize = require('../Utils/database');


const Group = sequelize.define('group',{
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },

    name: {
        type: Sequelize.STRING,
        allowNull: false
    }, groupUrl: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }

})

module.exports = Group;