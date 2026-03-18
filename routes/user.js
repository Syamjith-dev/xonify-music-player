var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');
var userHelpers = require('../helpers/user-helpers');
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user;
  console.log(user);
  productHelpers.getAllSongs().then((songs) => {
    res.render('user/view-songs', { songs, user });
  })

  // res.render('index', { products, user: true });
});
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {
    res.render('user/login', { 'loginErr': req.session.loginErr })
    req.session.loginErr = false
  }
});
router.get('/sign-up', (req, res) => {
  res.render('user/sign-up')
});
router.post('/sign-up', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
    res.redirect('/login')
  })
})
router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.loginErr = "invalid email/password!"
      res.redirect('/login')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})
router.get('/my-collection', verifyLogin,async (req, res) => {
  let likedSongs =await userHelpers.getLikedSongs(req.session.user._id)
  console.log(likedSongs)
  res.render('user/view-songs', { myCollection: true, likedSongs })
})
router.get('/add-to-liked/:id', verifyLogin, (req, res) => {
  userHelpers.addToLiked(req.params.id, req.session.user._id).then(() => {
    res.redirect('/')
  })
})




module.exports = router;
