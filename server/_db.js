'use strict';

var Sequelize = require('sequelize');

var databaseURI = process.env.DB_URI;

var db = new Sequelize(databaseURI, {
  define: {
    timestamps: false,
    underscored: true
  }
});

module.exports = db;
