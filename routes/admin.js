var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');
const cloudinary = require('../config/cloudinary');


/* GET all songs */
router.get('/', function (req, res) {

  productHelpers.getAllSongs().then((songs) => {
    console.log(songs)
    res.render('admin/view-songs', { admin: true, songs });
  })

});


/* GET add songs page */
router.get('/add-songs', (req, res) => {
  res.render('admin/add-songs');
});


/* POST add songs (🔥 Cloudinary upload) */
router.post('/add-songs', async (req, res) => {

  try {
    console.log(req.body);

    // check files
    if (!req.files || !req.files.Image || !req.files.Src) {
      console.log('Image or Song missing');
      return res.redirect('/admin/add-songs');
    }

    let image = req.files.Image;
    let song = req.files.Src;

    // 🔥 Upload image
    let imageUpload = await cloudinary.uploader.upload(image.tempFilePath, {
      folder: "songs-images"
    });

    // 🔥 Upload song (mp3)
    let songUpload = await cloudinary.uploader.upload(song.tempFilePath, {
      resource_type: "video", // audio/video upload
      folder: "songs"
    });

    // 🔥 Save to DB
    productHelpers.addSongs({
      Name: req.body.Name,
      Artist: req.body.Artist,
      image: imageUpload.secure_url,
      song: songUpload.secure_url
    }, (id) => {
      console.log("Song Added with ID:", id);
      res.redirect('/admin/add-songs');
    });

  } catch (err) {
    console.log("Upload Error:", err);
    res.redirect('/admin/add-songs');
  }

});


/* DELETE song */
router.get('/delete-song/:id', (req, res) => {
  let songId = req.params.id;

  productHelpers.deleteSong(songId).then(() => {
    res.redirect('/admin/');
  });
});


/* EDIT song page */
router.get('/edit-song/:id', async (req, res) => {
  try {
    let song = await productHelpers.playSong(req.params.id); // ✅ correct function
    res.render('admin/edit-song', { song });
  } catch (err) {
    console.log(err);
    res.redirect('/admin/');
  }
});


module.exports = router;
