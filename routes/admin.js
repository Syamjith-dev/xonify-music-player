var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');


/* GET users listing. */
router.get('/', function (req, res, next) {

  productHelpers.getAllSongs().then((songs) => {
    console.log(songs)
    res.render('admin/view-songs', { admin: true, songs });
  })

});
router.get('/add-songs', (req, res) => {
  res.render('admin/add-songs');
});
router.post('/add-songs', (req, res) => {
  console.log(req.body);

  if (req.files && req.files.Image) {
    console.log(req.files.Image);
  } else {
    console.log('No image uploaded');
  }
  if (req.files && req.files.Src) {
    console.log(req.files.Src);
  } else {
    console.log('No song uploaded');
  }

  productHelpers.addSongs(req.body, (id) => {

  let image = req.files.Image
  let song = req.files.Src

  Promise.all([
    image.mv('./public/songs-images/' + id + '.png'),
    song.mv('./public/songs/' + id + '.mp3')
  ])
  .then(() => {
    res.redirect('/admin/add-songs')
  })
  .catch((err) => {
    console.log(err)
    res.redirect('/admin/add-songs')
  })
})
});

router.get('/delete-song/:id', (req, res) => {
  let songId = req.params.id
  console.log(songId)
  productHelpers.deleteSong(songId).then((response) => {
    res.redirect('/admin/')
  })
})
router.get('/edit-song/:id', async (req, res) => {
  let product = await productHelpers.getAllSongs(req.params.id)
  res.render('admin/edit-song')
})

module.exports = router;
