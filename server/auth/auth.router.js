'use strict';

var router = require('express').Router();

var HttpError = require('../utils/HttpError');
var User = require('../api/users/user.model');

var crypto = require('crypto');

router.post('/login', function (req, res, next) {
  if(!req.body.password) next(HttpError(401))

  User.findOne({
    where: {
        email: req.body.email
    }
  })
  .then(function (user) {
    var hashedPassword = crypto.pbkdf2Sync(req.body.password+'', user.salt, 100000, 100, 'sha512').toString('base64');
    if (!user && user.password !== hashedPassword) throw HttpError(401);
    req.login(user, function (err) {
      if (err) next(err);
      else res.json(user);
    });
  })
  .catch(next);
});

router.post('/signup', function (req, res, next) {
  User.create(req.body)
  .then(function (user) {
    req.login(user, function (err) {
      if (err) next(err);
      else res.status(201).json(user);
    });
  })
  .catch(next);
});

router.get('/me', function (req, res, next) {
  res.json(req.user);
});

router.delete('/me', function (req, res, next) {
  req.logout();
  res.status(204).end();
});

router.use('/google', require('./google.oauth'));

router.use('/twitter', require('./twitter.oauth'));

router.use('/github', require('./github.oauth'));

module.exports = router;
