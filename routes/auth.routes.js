const express = require("express");
const router = express.Router();
const fileUploader = require('./../config/cloudinary');

router.get("/signup", (req, res) => {
  res.render("auth/signup.hbs");
});


router.post('/signup', fileUploader.single("avatar"), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    res.send("WIP");
})


module.exports = router;
