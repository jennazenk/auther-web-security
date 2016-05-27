'use strict';

var Sequelize = require('sequelize');
var crypto = require('crypto');

var db = require('../../_db');

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
  salt: {
    type: Sequelize.STRING,
    defaultValue: function () {
      return crypto.randomBytes(16).toString('base64');
    }
  },
  password: {
    type: Sequelize.STRING,
    set: function (plaintext) {
      var hashedPassword = this.hash(plaintext);
      this.setDataValue('password', hashedPassword);
    }
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  googleId: Sequelize.STRING,
  twitterId: Sequelize.STRING,
  githubId: Sequelize.STRING
}, {
  instanceMethods: {
    hash: function (plaintext) {
      console.log(plaintext, this.getDataValue('salt'));
      return crypto.pbkdf2Sync(plaintext, this.salt, 10000, 64).toString('base64');
    },
    authenticate: function (attempt) {
      return this.password === this.hash(attempt);
    }
  },
  defaultScope: {
    attributes: {
      exclude: ['password', 'salt']
    }
  }
});

module.exports = User;
