'use strict';

var Sequelize = require('sequelize');

var db = require('../../_db');

var crypto = require('crypto');

var User = db.define('user', {
  name: Sequelize.STRING,
  photo: {
    type: Sequelize.STRING,
    defaultValue: '/images/default-photo.jpg'
  },
  phone: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: Sequelize.STRING,
  salt : {
    type : Sequelize.STRING
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  googleId: Sequelize.STRING,
  twitterId: Sequelize.STRING,
  githubId: Sequelize.STRING
}, {
  hooks : {
    beforeValidate : function(user) {
      user.salt = crypto.randomBytes(8).toString('base64');
      user.password = crypto.pbkdf2Sync(user.password, user.salt, 100000, 100, 'sha512').toString('base64');
    }
  }

});

module.exports = User;
