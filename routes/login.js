var express = require('express');
const fs = require("fs");
const bcrypt = require("bcrypt")
var router = express.Router();

const DATA_PATH = "./data/";
const USERS_PATH = DATA_PATH + "users/";

const LOGIN_FIELDS = [
  { type: "text", name: "name", label: "Name", required: true },
  { type: "password", name: "password", label: "Password", required: true },
]

router.get('/', (req, res, next) => {
  res.render('login', { title: "Login", fields: LOGIN_FIELDS, errorMessage: false })
});

router.post('/', (req, res, next) => {
  fs.readFile(`${USERS_PATH}/${req.body.name}.json`, 'utf8', async (err, data) => {
    if (err) {
      res.render('login', { title: "Login", fields: LOGIN_FIELDS, errorMessage: true })
    } else {
      bcrypt.compare(req.body.password, JSON.parse(data).password, (err, r) => {
        if (r) {
          let options = {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
            signed: false
          }
          res.cookie('connection', req.body.name, options);
          res.redirect(`profile/${req.body.name}`)
        } else {
          res.render('login', { title: "Login", fields: LOGIN_FIELDS, errorMessage: true })
        }
      });
    }
  });
})

module.exports = router;
