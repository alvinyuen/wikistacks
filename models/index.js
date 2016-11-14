var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack');

var pageSchema ={
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle:{
        type: Sequelize.STRING,
        allowNull: false
    },
    content:{
        type: Sequelize.STRING,
        allowNull: false
    },
    status:{
        type: Sequelize.STRING
    }
};
var pageConfig = {};

db.define('page', pageSchema, pageConfig);



var userSchema = {
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        unique:true,
        allowNull: false,
        validate:{
            isEmail:true
        }
    }
};
var userConfig ={};
db.define('user', userSchema, userConfig);