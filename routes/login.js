var express = require('express');
var router = express.Router();
const fs = require("fs");
const bcrypt = require("bcrypt");
const PATH = require("../config/path");
const socketAPI = require("../socketAPI");

const LOGIN_FIELDS = [
  { type: "text", name: "name", label: "Name", required: true },
  { type: "password", name: "password", label: "Password", required: true },
]

router.get('/', (req, res, next) => {
  res.render('login', { title: "Login", fields: LOGIN_FIELDS, errorMessagePassword: false, errorMessageUserAlreadyConnected: false });
});

router.post('/', (req, res, next) => {

  // If user connected on an other device / browser
  if (socketAPI.USERS.some(o => req.body.name in o)) {
    res.render('login', { title: "Login", fields: LOGIN_FIELDS, errorMessagePassword: false, errorMessageUserAlreadyConnected: true })
  }

  fs.readFile(`${PATH.USERS_PATH}/${req.body.name}.json`, 'utf8', async (err, data) => {
    if (err) {
      res.render('login', { title: "Login", fields: LOGIN_FIELDS, errorMessagePassword: true, errorMessageUserAlreadyConnected: false })
    } else {
      bcrypt.compare(req.body.password, JSON.parse(data).password, (err, r) => {
        if (r) {
          let options = {
            maxAge: 1000 * 60 * 60,
            httpOnly: false,
            signed: false
          }
          res.cookie('connection', req.body.name, options);
          res.redirect(`profile/${req.body.name}`);
        } else {
          res.render('login', { title: "Login", fields: LOGIN_FIELDS, errorMessagePassword: true, errorMessageUserAlreadyConnected: false })
        }
      });
    }
  });
})

module.exports = router;
