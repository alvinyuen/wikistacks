var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', { logging: false});

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
        type: Sequelize.TEXT,
        allowNull: false
    },
    status:{
        type: Sequelize.ENUM('open', 'closed'),
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },

};
var pageConfig = {
    getterMethods : {
        route : function () {
            return '/wiki/'+ this.urlTitle;
        }
    }
};

var Page = db.define('page', pageSchema, pageConfig);



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

var User = db.define('user', userSchema, userConfig);

module.exports = {
    Page : Page,
    User : User,
    db : db
}