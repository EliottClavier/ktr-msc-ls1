var express = require('express');
var router = express.Router();
const uuid = require("uuid");
const fs = require("fs");
const PATH = require("../config/path");

const LIBRARY_FIELDS = [
  {
    split: [
      { type: "text", name: "name", label: "Name", required: false },
      { type: "text", name: "companyName", label: "Company name", required: false },
    ],
  },
  { type: "email", name: "mail", label: "Email address", required: true },
  { type: "tel", name: "phoneNumber", label: "Telephone number", required: false, pattern: "[0-9]{10}" },
]

router.get('/', (req, res, next) => {
  if (!req.cookies.connection) {
    res.redirect('/login/')
  } else {
    res.render('library', { title: "Create business card", fields: LIBRARY_FIELDS });
  }
});

router.post('/', (req, res, next) => {
  let id = uuid.v4();
  fs.writeFile(PATH.BUSINESS_CARDS_PATH + id + ".json", JSON.stringify(req.body, null, '\t'), (err) => {
    if (err) {
      res.send(err.toString());
    } else {
      let userData = JSON.parse(fs.readFileSync(PATH.USERS_PATH + req.cookies.connection + ".json"));
      if (userData) {
        userData.businessCards.push(`${id}.json`);
        fs.writeFileSync(PATH.USERS_PATH + req.cookies.connection + ".json", JSON.stringify(userData, null, '\t'));
        res.status(201).redirect('/profile/' + req.cookies.connection);
      } else {
        res.status(404);
      }
    }
  });
});

module.exports = router;
