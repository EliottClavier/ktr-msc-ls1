var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  if (req.cookies && req.cookies.connection) {
    res.redirect('/profile/' + req.cookies.connection)
  } else {
    res.redirect('/profile');
  }
});

module.exports = router;
