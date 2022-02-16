var express = require('express');
var router = express.Router();
const fs = require("fs");
const bcrypt = require('bcrypt');
const PATH = require("../config/path");
const uuid = require("uuid");

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
    fs.readdir(PATH.USERS_PATH, (err, files) => {
      files = files.map(f => f.replace('.json', ''));
      res.render('register', { title: "Profile", fields: REGISTER_FIELDS, usersList: files });
    });
  }
});

router.get('/:name', (req, res, next) => {
  if (!req.cookies.connection) {
    res.redirect('/login')
  } else if (req.params["name"] !== req.cookies.connection) {
    res.redirect('/profile/' + req.cookies.connection)
  } else {
    fs.readFile(`${PATH.USERS_PATH}/${req.cookies.connection}.json`, 'utf8', (err, data) => {
      if (err) {
        res.redirect('/login');
      } else {
        data = JSON.parse(data);
        data.businessCards = data.businessCards.map(bc => JSON.parse(fs.readFileSync(`${PATH.BUSINESS_CARDS_PATH}${bc}`)));
        res.render('profile', { title: "Your profile", username: req.cookies.connection, userData: data })
      }
    });
  }
});

router.post('/', async (req, res, next) => {
  let ownBusinessCard = {
    name: req.body.name,
    companyName: req.body.companyName,
    mail: req.body.mail,
    phoneNumber: req.body.phoneNumber
  }

  let id = uuid.v4();
  fs.writeFile(PATH.BUSINESS_CARDS_PATH + id + ".json", JSON.stringify(ownBusinessCard, null, '\t'), async (err) => {
    if (err) {
      res.send(err.toString())
    } else {
      let userProfile = {
        password: await hashPassword(req.body.password),
        personnalBusinessCard: `${id}.json`,
        businessCards: [],
      }

      fs.writeFile(PATH.USERS_PATH + req.body.name + ".json", JSON.stringify(userProfile, null, '\t'), (errScope) => {
        if (errScope) {
          res.send(errScope.toString());
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
    }
  });
});

router.post('/logout', async (req, res, next) => {
  res.clearCookie("connection");
  res.redirect('/profile');
})

module.exports = router;
