const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dmwdgiyey',
  api_key: '384252811251129',
  api_secret: 'pHLlyobbSog6IxmGMH5xp44Tj0M'
});

module.exports = cloudinary;