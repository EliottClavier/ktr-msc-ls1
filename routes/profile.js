var express = require('express');
var router = express.Router();
const fs = require("fs");
const bcrypt = require('bcrypt');

const DATA_PATH = "./data/";
const USERS_PATH = DATA_PATH + "users/";

const REGISTER_FIELDS = [
  {
    split: [
      { type: "text", name: "name", label: "Name", required: true },
      { type: "text", name: "companyName", label: "Company name", required: false },
    ],
  },
  { type: "email", name: "mail", label: "Email address", required: false },
  { type: "tel", name: "phoneNumber", label: "Telephone number", required: false, pattern: "[0-9]{10}" },
  {
    split: [
      { type: "password", name: "password", label: "Password", required: true, minlength: 8 },
      { type: "password", name: "confirmPassword", label: "Confirm password", required: true, minlength: 8 },
    ],
  },
];

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt);
}

router.get('/', (req, res, next) => {
  if (req.cookies.connection) {
    res.redirect('/profile/' + req.cookies.connection)
  } else {
    fs.readdir(USERS_PATH, (err, files) => {
      files = files.map(f => f.replace('.json', ''));
      res.render('register', { title: "Profile", fields: REGISTER_FIELDS, usersList: files });
    });
  }
});

router.get('/:name', (req, res, next) => {
  if (!req.cookies.connection) {
    res.redirect('/profile')
  } else if (req.params["name"] !== req.cookies.connection) {
    res.redirect('/profile/' + req.cookies.connection)
  } else {
    fs.readFile(`${USERS_PATH}/${req.cookies.connection}.json`, 'utf8', (err, data) => {
      console.log(err)
      err ? res.redirect('/profile') : res.render('profile', { title: "Your profile", userData: JSON.parse(data) })
    });
  }
});

router.post('/', async (req, res, next) => {
  req.body.confirmPassword && (delete req.body.confirmPassword);
  req.body.password = await hashPassword(req.body.password);
  fs.writeFile(USERS_PATH + req.body.name + ".json", JSON.stringify(req.body, null, '\t'), (err) => {
    if (err) {
      res.send(err.toString());
    } else {
      let options = {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        signed: false
      }
      res.cookie('connection', req.body.name, options);
      res.status(200).redirect('/profile/' + req.body.name)
    }
  });
});

router.post('/logout', async (req, res, next) => {
  res.clearCookie("connection");
  res.redirect('/profile');
})

module.exports = router;
