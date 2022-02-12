var express = require('express');
var router = express.Router();
const fs = require("fs");

const DATA_PATH = "./data/";
const USERS_PATH = DATA_PATH + "users/";

const REGISTER_FIELDS = [
  { type: "text", name: "name", label: "Name", required: true },
  { type: "text", name: "companyName", label: "Company name", required: false },
  { type: "email", name: "mail", label: "Email address", required: false },
  { type: "tel", name: "phoneNumber", label: "Telephone number", required: false, pattern: "[0-9]{10}" },
]

router.get('/', function(req, res, next) {
  res.render('register', { title: 'Register', fields: REGISTER_FIELDS });
});

router.post('/', function(req, res, next) {
  fs.writeFile(USERS_PATH + req.body.name + ".json", JSON.stringify(req.body, null, '\t'), (err) =>
    err ? res.send(err.toString()) : res.status(200).redirect('/profile')
  );
});

module.exports = router;
